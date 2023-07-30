import { Request, Response, Router } from "express";
import {
  deleteTranscription,
  transcribe,
  transcriptionStatus,
} from "./transcriber";

import multer from "multer";

const upload = multer({ dest: process.env.WORK_DIR || "/tmp" });

const routes = Router();

routes.post(
  "/transcribe",
  upload.single("file"),
  async (req: Request, res: Response) => {
    console.log(`transcribing file ${req.file.originalname}`);
    const id = await transcribe(
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
});

routes.delete("/result/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  deleteTranscription(id);
  res.send({ ok: true });
});

export default routes;
