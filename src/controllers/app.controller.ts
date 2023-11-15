import { NextFunction, Request, Response } from "express";
import BadRequest from "../middlewares/exceptions/bad-request";
import { removeFile } from "../services/file";
import { encodeHLSWithMultipleVideoStreams } from "../services/convert";
import * as path from "path";
import Business from "../middlewares/exceptions/business";

export class AppController {
  async uploadMovie(req: Request, res: Response, next: NextFunction) {
    const filename = req.file?.filename;
    try {
      // if (filename) await encodeHLSWithMultipleVideoStreams(filename);

      res.customSuccess(200, {});
    } catch (e: any) {
      removeFile(filename as string);
      return next(new BadRequest({ message: e.message }));
    }
  }

  async streamFile(req: Request, res: Response, next: NextFunction) {
    try {
      const { folder, name, subname } = req.params;
      let pathfile = "";
      if (name.includes("m3u8")) {
        pathfile = path.join(process.cwd(), "uploads", folder, name);
      } else if (
        subname &&
        (subname.includes("m3u8") || subname.includes("ts"))
      )
        pathfile = path.join(process.cwd(), "uploads", folder, name, subname);
      else
        throw new Business({
          message: "Dịch vụ không có sẵn! Vui lòng thử lại!",
        });
      res.sendFile(pathfile);
    } catch (e: any) {
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
