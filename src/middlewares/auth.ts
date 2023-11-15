import { envConfig } from "./../configs/env.config";
import Authorization from "./exceptions/authorization";

import jwt from "jsonwebtoken";

class VerifyJWTToken {
  verifyToken(req, res, next) {
    const token = req.headers.token || req.headers.authorization;

    if (token) {
      const accessToken = token.split(" ")[1];
      // console.log(accessToken);
      jwt.verify(accessToken, envConfig.JWT_SECRET, (err, user) => {
        if (err) {
          throw new Authorization({ message: "Mã xác thực không đúng" });
        }
        req.user = user;
        console.log("user", user);
        return next();
      });
    } else {
      throw new Authorization({ message: "Bạn cần có mã xác thực" });
    }
  }

  verifyTokenAndAdmin(req, res, next) {
    const verifyJWTToken = new VerifyJWTToken();
    verifyJWTToken.verifyToken(req, res, () => {
      console.log(req.user.isAdmin);
      if (req.user.id && req.user.isAdmin) {
        return next();
      } else {
        throw new Authorization({
          message: "Bạn không có quyền truy cập nội dung này!",
        });
      }
    });
  }
}

const auth = new VerifyJWTToken();
export default auth;
