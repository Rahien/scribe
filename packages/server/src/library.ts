import fs from "fs";
import { StatusRecord } from "./transcriber";
import { runShellCommand } from "./util";
import { Response } from "express";
import { type Express } from "express";

const LIBRARY_DIR = process.env.LIBRARY_DIR || "/tmp/library";

const ensureLibraryDir = async (id: string) => {
  await ensureLibraryBase();
  if (!fs.existsSync(`${LIBRARY_DIR}/${id}`)) {
    await fs.mkdirSync(`${LIBRARY_DIR}/${id}`, { recursive: true });
  }
};

const ensureLibraryBase = async () => {
  if (!fs.existsSync(`${LIBRARY_DIR}`)) {
    await fs.mkdirSync(`${LIBRARY_DIR}`, { recursive: true });
  }
};

export const writeToLibrary = async (id: string, result: StatusRecord) => {
  await ensureLibraryDir(id);
  fs.writeFileSync(
    `${LIBRARY_DIR}/${id}/result.json`,
    JSON.stringify(result, null, 2)
  );
};

export const createMetadata = async (id: string, file: Express.Multer.File) => {
  await ensureLibraryDir(id);
  fs.writeFileSync(
    `${LIBRARY_DIR}/${id}/metadata.json`,
    JSON.stringify(
      {
        originalname: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        createdAt: new Date().toISOString(),
      },
      null,
      2
    )
  );
};

export const readMetadata = async (id: string) => {
  await ensureLibraryDir(id);
  const text = fs.readFileSync(`${LIBRARY_DIR}/${id}/metadata.json`, "utf8");
  return JSON.parse(text);
};

export const readFromLibrary = async (id: string) => {
  await ensureLibraryDir(id);
  const text = fs.readFileSync(`${LIBRARY_DIR}/${id}/result.json`, "utf8");
  return JSON.parse(text);
};

export const listLibrary = async () => {
  await ensureLibraryBase();
  const transcriptions = fs.readdirSync(LIBRARY_DIR);
  const transcriptionsWithMetaData = await Promise.all(
    transcriptions.map(async (id) => {
      return { ...(await readMetadata(id)), id };
    })
  );
  transcriptionsWithMetaData.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  return transcriptionsWithMetaData;
};

export const moveAudioToLibrary = async (id: string, file: string) => {
  await ensureLibraryDir(id);
  await runShellCommand(`mv ${file} ${LIBRARY_DIR}/${id}/audio.mp3`);
};

export const readAudioFromLibrary = async (id: string, res: Response) => {
  res.download(`${LIBRARY_DIR}/${id}/audio.mp3`);
};

export const deleteFromLibrary = async (id: string) => {
  fs.rmSync(`${LIBRARY_DIR}/${id}`, { recursive: true });
};
