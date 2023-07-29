import { Stream } from "stream";
import { v4 } from "uuid";

const { exec } = require("child_process");

type StatusRecord = {
  originalname: string;
  started: number;
};
const status = {} as Record<string, StatusRecord>;

function streamToString(stream: Stream) {
  const chunks = [] as Buffer[];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on("error", (err) => reject(err));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
}

const runShellCommand = async (command: string) => {
  const { stdout, stderr } = await exec(command);
  if (stderr) {
    stderr.pipe(process.stdout);
  }
  const result = await streamToString(stdout);
  return result;
};

const splitMp3 = async (target: string) => {
  const WORK_DIR = process.env.WORK_DIR || "/tmp";
  const command = `ffmpeg -y -loglevel repeat+level+error -i ${WORK_DIR}/${target}/input.mp3 -f segment -segment_time 120 -c copy ${WORK_DIR}/${target}/out%03d.mp3`;
  console.log(command);
  await runShellCommand(command);
  const removeCommand = `rm ${WORK_DIR}/${target}/input.mp3`;
  await runShellCommand(removeCommand);
};

const transformToMp3 = async (target: string, mimetype: string) => {
  const WORK_DIR = process.env.WORK_DIR || "/tmp";
  if (mimetype === "audio/mp3") {
    const moveCommand = `mv ${WORK_DIR}/${target}/original ${WORK_DIR}/${target}/input.mp3`;
    await runShellCommand(moveCommand);
    return;
  }
  const command = `ffmpeg -y -loglevel repeat+level+error -i ${WORK_DIR}/${target}/original -vn -ar 44100 -ac 2 -ab 192k -f mp3 ${WORK_DIR}/${target}/input.mp3`;
  await runShellCommand(command);
  const removeCommand = `rm ${WORK_DIR}/${target}/original`;
  await runShellCommand(removeCommand);
};

const moveToWorkDir = async (path: string, target: string) => {
  const WORK_DIR = process.env.WORK_DIR || "/tmp";
  const command = `mkdir ${WORK_DIR}/${target} && mv ${path} ${WORK_DIR}/${target}/original`;
  await runShellCommand(command);
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
  moveToWorkDir(file.path, id).then(async () => {
    await transformToMp3(id, file.mimetype);
    await splitMp3(id);
  });
  return id;
};
