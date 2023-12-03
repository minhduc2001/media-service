import { Request, Response, Router } from "express";
import { AppController } from "../controllers/app.controller";
import upload from "../middlewares/multer";
import auth from "../middlewares/auth";

const appController = new AppController();
const router: Router = Router();

router.get("/:folder/:name", auth.verifyToken, appController.streamFile);

router.get(
  "/:folder/:name/:subname",
  auth.verifyToken,
  appController.streamFile
);

router.post(
  "/upload/:id",
  auth.verifyTokenAndAdmin,
  upload.single("music"),
  appController.uploadMusic
);

export default router;
