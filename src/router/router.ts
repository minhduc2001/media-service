import { Router } from "express";
import movie from "./movie";
import music from "./music";

const router: Router = Router();
router.use("/movie", movie);
router.use("/music", music);

export default router;
