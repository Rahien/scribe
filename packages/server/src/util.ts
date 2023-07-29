import { Stream } from "stream";

import { exec } from "child_process";

export const streamToString = (stream: Stream) => {
  const chunks = [] as Buffer[];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on("error", (err) => reject(err));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
};

export const runShellCommand = async (command: string) => {
  const { stdout, stderr } = await exec(command);
  if (stderr) {
    stderr.pipe(process.stdout);
  }
  const result = await streamToString(stdout);
  return result;
};
