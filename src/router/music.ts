import { Request, Response, Router } from "express";
import { AppController } from "../controllers/app.controller";
import upload from "../middlewares/multer";

const appController = new AppController();
const router: Router = Router();

router.post("/upload-music", upload.single("music"), appController.uploadMusic);

export default router;
