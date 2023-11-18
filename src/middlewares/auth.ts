import { NextFunction, Request, Response } from "express";
import { envConfig } from "./../configs/env.config";
import Authorization from "./exceptions/authorization";

import jwt from "jsonwebtoken";
import fetcher from "../utils/fetcher";
import { IResponse } from "../interfaces";
import Business from "./exceptions/business";

export interface CustomRequest extends Request {
  user?: any;
  token?: string;
}

class VerifyJWTToken {
  async verifyToken(req: CustomRequest, res: Response, next: NextFunction) {
    const token: string =
      (req.headers.token as string) || (req.headers.authorization as string);

    if (token) {
      const accessToken = token.split(" ")[1];
      jwt.verify(
        accessToken,
        envConfig.JWT_SECRET,
        async (err: any, userDecode: any) => {
          if (err) {
            return next(
              new Authorization({ message: "Mã xác thực không đúng" })
            );
          }

          try {
            const { data } = await fetcher.GET<IResponse>("/user/me", {
              baseURL: envConfig.BASE_URL_MAIN_SERVER,
              timeout: 10000,
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });

            if (!data)
              return next(
                new Authorization({ message: "Mã xác thực không hợp lệ!" })
              );

            req.user = data;
            req.token = token;
          } catch (error: any) {
            return next(
              new Business({
                message: error.message ?? "Có lỗi xảy ra xin vui lòng thử lại!",
              })
            );
          }

          return next();
        }
      );
    } else {
      return next(new Authorization({ message: "Bạn cần có mã xác thực" }));
    }
  }

  async verifyTokenAndAdmin(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const auth = new VerifyJWTToken();

      await auth.verifyToken(req, res, () => {
        if (req.user.id && req.user.role == "admin") {
          return next();
        } else {
          return next(
            new Authorization({
              message: "Bạn không có quyền truy cập nội dung này!",
            })
          );
        }
      });
    } catch (error) {
      return next(error);
    }
  }
}

const auth = new VerifyJWTToken();
export default auth;
