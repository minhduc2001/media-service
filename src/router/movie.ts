import { Router } from "express";
import upload from "../middlewares/multer";
import { AppController } from "../controllers/app.controller";
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
  upload.single("movie"),
  appController.uploadMovie
);

export default router;
