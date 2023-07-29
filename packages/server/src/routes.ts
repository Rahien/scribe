import { Router } from "express";
import { transcribe } from "./transcriber";

const routes = Router();

routes.get("/transcribe", async (req, res) => {
  const result = await transcribe();
  return res.json({ message: result });
});

export default routes;
