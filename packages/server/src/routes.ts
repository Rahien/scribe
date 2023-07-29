import { Request, Response, Router } from "express";
import { transcribe } from "./transcriber";

import multer from "multer";

const upload = multer({ dest: process.env.WORK_DIR || "/tmp" });

const routes = Router();

routes.post(
  "/transcribe",
  upload.single("file"),
  async (req: Request, res: Response) => {
    console.log(req.body);
    console.log(req.file);

    const id = await transcribe(req.file);
    res.send({ id });
  }
);

export default routes;
