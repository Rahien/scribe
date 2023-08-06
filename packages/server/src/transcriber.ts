import fs from "fs";
import FormData from "form-data";
import fetch from "node-fetch";
import { audioFileToMp3Chunks } from "./mp3Prep";
import { runShellCommand } from "./util";
import schedule from "node-schedule";

export type StatusRecord = {
  originalname: string;
  started: number;
  finished?: number;
  result?: { index: number; json: string }[];
  error?: any;
  partCount?: number;
  partLength?: number;
};
const status = {} as Record<string, StatusRecord>;

const transcribeFile = async (path: string, lang: string) => {
  const formData = new FormData();
  formData.append("audio_file", fs.createReadStream(path));

  const result = await fetch(
    `${process.env.WHISPER_URL}/asr?task=transcribe&language=${lang}&encode=true&output=json`,
    {
      method: "post",
      body: formData,
    }
  ).then(async (res: any) => {
    const text = await res.text();
    if (res.status === 200) {
      return JSON.parse(text);
    } else {
      return { error: text };
    }
  });

  return result;
};

const transcriptionQueue = [] as {
  path: string;
  id: string;
  index: number;
  lang: string;
}[];
const runningTranscriptions = {} as Record<string, boolean>;

const transcribeAllFiles = async (id: string, lang: string) => {
  const WORK_DIR = process.env.WORK_DIR || "/tmp";
  const files = fs.readdirSync(`${WORK_DIR}/${id}`);
  files.sort((a, b) => {
    return (
      parseInt(a.replace("out", "").replace(".mp3", "")) -
      parseInt(b.replace("out", "").replace(".mp3", ""))
    );
  });

  status[id].partCount = files.length;

  let index = 0;
  while (files.length > 0) {
    const file = files.shift();

    transcriptionQueue.push({
      path: `${WORK_DIR}/${id}/${file}`,
      id,
      index,
      lang,
    });
    index += 1;
  }
};

const cleanup = async (id: string, path: string) => {
  await runShellCommand(`rm -rf ${path}`);
  if (status[id]?.partCount === status[id]?.result?.length) {
    await runShellCommand(`rm -rf ${process.env.WORK_DIR}/${id}`);
    status[id].finished = new Date().getTime();
  }
};

const pickFromTranscriptionQueue = async () => {
  // dumb transcription queue, single threaded as the main work is done by
  // whisper and this app is assumed to be used by a single user
  const parallelism = parseInt(process.env.PARALLELISM || "2", 10);
  if (Object.keys(runningTranscriptions).length >= parallelism) {
    return;
  }
  const toTranscribe = transcriptionQueue.shift();
  if (!toTranscribe) {
    return;
  }

  const { path, lang, index, id } = toTranscribe;
  runningTranscriptions[path] = true;
  const json = await transcribeFile(path, lang);

  status[id].result = status[id].result || [];

  status[id].result.push({ index, json });
  status[id].result.sort((a, b) => a.index - b.index);
  await cleanup(id, path);
  delete runningTranscriptions[path];
};

export const transcribe = async (
  id: string,
  file: {
    path: string;
    mimetype: string;
    originalname: string;
  },
  lang: string,
  partLength: number
) => {
  status[id] = {
    originalname: file.originalname,
    started: new Date().getTime(),
    partLength: partLength,
  };
  Promise.resolve()
    .then(async () => {
      await audioFileToMp3Chunks(id, file, partLength);
      await transcribeAllFiles(id, lang);
    })
    .catch((err) => {
      status[id].error = err;
    });

  return id;
};

export const transcriptionStatus = (id: string) => {
  return status[id];
};

export const deleteTranscription = (id: string) => {
  delete status[id];
};

schedule.scheduleJob("* * * * * *", pickFromTranscriptionQueue);
