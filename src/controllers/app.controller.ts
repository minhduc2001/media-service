import { NextFunction, Request, Response } from "express";
import BadRequest from "../middlewares/exceptions/bad-request";
import { removeFile } from "../services/file";
import { encodeHLSWithMultipleVideoStreams } from "../services/convert";

export class AppController {
  async uploadMovie(req: Request, res: Response, next: NextFunction) {
    const filename = req.file?.filename;
    try {
      if (filename) await encodeHLSWithMultipleVideoStreams(filename);

      res.customSuccess(200, {});
    } catch (e: any) {
      removeFile(filename as string);
      return next(new BadRequest({ message: e.message }));
    }
  }

  async uploadMusic(req: Request, res: Response, next: NextFunction) {
    const filename = req.file?.filename;
    try {
      res.customSuccess(200, {});
    } catch (e: any) {
      if (filename) removeFile(filename);
      return next(new BadRequest({ message: e.message }));
    }
  }
}
