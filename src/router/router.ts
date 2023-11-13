import { Router } from "express";
import movie from "./movie";
import music from "./music";

const router: Router = Router();
router.use("/", movie);
router.use("/", music);

export default router;
