import { NextFunction, Request, Response } from "express";
import BadRequest from "../middlewares/exceptions/bad-request";
import { removeFile } from "../services/file";
import { encodeHLSWithMultipleVideoStreams } from "../services/convert";
import * as path from "path";
import Business from "../middlewares/exceptions/business";
import fetcher from "../utils/fetcher";
import { envConfig } from "../configs/env.config";
import { CustomRequest } from "../middlewares/auth";
import { IResponse } from "../interfaces";
import Movie from "../models/Movie";
import Music from "../models/Music";

export class AppController {
  async uploadMovie(req: CustomRequest, res: Response, next: NextFunction) {
    const filename = req.file?.filename;
    const id = req.params.id;

    try {
      const movie = new Movie();
      movie.movieId = Number(id);
      await movie.save();

      let check = false;
      if (filename) check = await encodeHLSWithMultipleVideoStreams(filename);

      if (!check) throw new Business({ message: "Không convert được file!" });
      movie.url = filename;
      await movie.save();

      const data = await fetcher.PATCH<IResponse>(
        `/movie/${id}/url`,
        { filename: filename },
        {
          baseURL: envConfig.BASE_URL_MAIN_SERVER,
          timeout: 15000,
          headers: { Authorization: `${req.token}` },
        }
      );

      if (!data.success) {
        throw new BadRequest({ message: data.message });
      }

      movie.isUpdate = true;
      await movie.save();

      res.customSuccess(200, null, "Tải lên thành công");
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

  async uploadMusic(req: CustomRequest, res: Response, next: NextFunction) {
    const filename = req.file?.filename;
    const id = req.params.id;

    try {
      const music = new Music();
      music.musicId = Number(id);
      await music.save();

      let check = false;
      if (filename) check = await encodeHLSWithMultipleVideoStreams(filename);

      if (!check) throw new Business({ message: "Không convert được file!" });
      music.url = filename;
      await music.save();

      const data = await fetcher.PATCH<IResponse>(
        `/music/${id}/url`,
        { filename: filename },
        {
          baseURL: envConfig.BASE_URL_MAIN_SERVER,
          timeout: 15000,
          headers: { Authorization: `${req.token}` },
        }
      );

      if (!data.success) {
        throw new BadRequest({ message: data.message });
      }

      music.isUpdate = true;
      await music.save();

      res.customSuccess(200, null, "Tải lên thành công");
    } catch (e: any) {
      removeFile(filename as string);
      return next(new BadRequest({ message: e.message }));
    }
  }
}
