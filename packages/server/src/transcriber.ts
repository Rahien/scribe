import { Stream } from "stream";

const { exec } = require("child_process");

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
  const command = `ffmpeg -loglevel repeat+level+error -i ${WORK_DIR}/${target}/input.mp3 -f segment -segment_time 120 -c copy ${WORK_DIR}/${target}/out%03d.mp3`;
  console.log(command);
  const result = await runShellCommand(command);
  return result;
};

const transformToMp3 = async (target: string, original: string) => {
  const WORK_DIR = process.env.WORK_DIR || "/tmp";
  const command = `ffmpeg -loglevel repeat+level+error -i ${WORK_DIR}/${target}/${original} -vn -ar 44100 -ac 2 -ab 192k -f mp3 ${WORK_DIR}/${target}/input.mp3`;
  await runShellCommand(command);
};

export const transcribe = async () => {
  await transformToMp3("test", "original.m4a");
  return splitMp3("test");
};
