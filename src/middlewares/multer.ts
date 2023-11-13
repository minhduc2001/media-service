import { existsSync, mkdirSync } from "fs";
import { Request } from "express";
import multer, { diskStorage } from "multer";
import * as uuid from "uuid";
import { extname } from "path";
import { envConfig } from "../configs/env.config";
import BadRequest from "./exceptions/bad-request";

const multerConfig = {
  dest: envConfig.UPLOAD_LOCATION,
};

const storage = multer.diskStorage({
  destination: (req: Request, file: any, cb: any) => {
    const uploadPath = multerConfig.dest;
    // Create folder if doesn't exist
    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req: Request, file, cb) => {
    cb(null, uuid.v4().toString() + "_" + file.originalname);
  },
});

const fileFilter = (req: Request, file: any, cb: any) => {
  if (file.mimetype.match(/audio/) || file.mimetype.match(/video/)) {
    cb(null, true);
  } else {
    cb(
      new BadRequest({
        message: `Unsupported file type ${extname(file.originalname)}`,
      }),
      false
    );
  }
};

const multerOptions: multer.Options = {
  limits: {
    fileSize: envConfig.MAX_FILE_SIZE,
  },
  fileFilter,
  storage,
};
const upload = multer(multerOptions);
export default upload;
