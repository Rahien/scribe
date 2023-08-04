import { Request, Response, Router } from "express";
import {
  deleteTranscription,
  transcribe,
  transcriptionStatus,
} from "./transcriber";

import multer from "multer";
import {
  createMetadata,
  deleteFromLibrary,
  listLibrary,
  readAudioFromLibrary,
  readFromLibrary,
  writeToLibrary,
} from "./library";
import { v4 } from "uuid";

const upload = multer({ dest: process.env.WORK_DIR || "/tmp" });

const routes = Router();

routes.post(
  "/transcribe",
  upload.single("file"),
  async (req: Request, res: Response) => {
    const id = v4();
    await createMetadata(id, req.file);

    console.log(`transcribing file ${req.file.originalname}`);
    await transcribe(
      id,
      req.file,
      req.body.lang,
      parseInt(req.body.partLength, 10)
    );
    res.send({ id });
  }
);

routes.get("/status/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const status = transcriptionStatus(id);
  if (status) {
    res.send({
      originalname: status.originalname,
      started: status.started,
      totalParts: status.partCount,
      partsDone: status.result?.length || 0,
      partLength: status.partLength,
      error: status.error && {
        stack: status.error.stack,
        message: status.error.message || status.error,
      },
    });
  } else {
    res.status(404).send({ error: "not found" });
  }
});

routes.get("/result/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const status = transcriptionStatus(id);
  if (!status) {
    res.status(404).send({ error: "not found" });
    return;
  }

  res.send({
    originalname: status.originalname,
    result: status.result,
    totalParts: status.partCount,
    partLength: status.partLength,
    started: status.started,
    finished: status.finished,
    error: status.error && {
      stack: status.error.stack,
      message: status.error.message || status.error,
    },
  });

  writeToLibrary(id, status);
});

routes.get("/library", async (req: Request, res: Response) => {
  res.send(await listLibrary());
});

routes.get("/library/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  res.send(await readFromLibrary(id));
});

routes.get("/library/:id/audio.mp3", (req: Request, res: Response) => {
  const id = req.params.id;
  readAudioFromLibrary(id, res);
});

routes.delete("/library/:id", (req: Request, res: Response) => {
  deleteFromLibrary(req.params.id);
  res.send({ ok: true });
});

routes.delete("/result/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  deleteTranscription(id);
  res.send({ ok: true });
});

export default routes;
