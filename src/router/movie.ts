import { Router } from "express";
import upload from "../middlewares/multer";
import { AppController } from "../controllers/app.controller";

const appController = new AppController();
const router: Router = Router();
router.post("/upload-movie", upload.single("movie"), appController.uploadMovie);

export default router;
