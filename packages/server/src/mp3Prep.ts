import { moveAudioToLibrary } from "./library";
import { runShellCommand } from "./util";

const splitMp3 = async (target: string, partLength: number) => {
  const WORK_DIR = process.env.WORK_DIR || "/tmp";
  const command = `ffmpeg -y -loglevel repeat+level+error -i ${WORK_DIR}/${target}/input.mp3 -f segment -segment_time ${partLength} -c copy ${WORK_DIR}/${target}/out%03d.mp3`;
  await runShellCommand(command);
  await moveAudioToLibrary(target, `${WORK_DIR}/${target}/input.mp3`);
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

export const audioFileToMp3Chunks = async (
  jobId: string,
  file: {
    path: string;
    mimetype: string;
    originalname: string;
  },
  partLength: number
) => {
  await moveToWorkDir(file.path, jobId);
  await transformToMp3(jobId, file.mimetype);
  await splitMp3(jobId, partLength);
};
