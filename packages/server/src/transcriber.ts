import { v4 } from "uuid";
import fs from "fs";
import FormData from "form-data";
import fetch from "node-fetch";
import { audioFileToMp3Chunks } from "./mp3Prep";

type StatusRecord = {
  originalname: string;
  started: number;
};
const status = {} as Record<string, StatusRecord>;

const transcribeFile = async (path: string) => {
  const formData = new FormData();
  formData.append("audio_file", fs.createReadStream(path));

  formData.append("task", "transcribe");
  formData.append("language", "nl");
  formData.append("encode", "false");
  formData.append("output", "txt");

  const result = await fetch(`${process.env.WHISPER_URL}/asr`, {
    method: "post",
    body: formData,
  }).then((res: any) => {
    return res.text();
  });

  return result;
};

export const transcribe = async (file: {
  path: string;
  mimetype: string;
  originalname: string;
}) => {
  const id = v4();
  status[id] = {
    originalname: file.originalname,
    started: new Date().getTime(),
  };
  Promise.resolve().then(async () => {
    await audioFileToMp3Chunks(id, file);
    await transcribeFile(`/${process.env.WORK_DIR}/${id}/out000.mp3`);
  });

  return id;
};
