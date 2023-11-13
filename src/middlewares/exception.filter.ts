import { NextFunction, Request, Response } from "express";
import HttpException from "../utils/http-exception";

function exceptionFilter(
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = error.status || 500;
  const message = error.message || "Something went wrong";

  console.error(error);

  res.status(status).send({
    ...error,
    message,
    status,
  });
}

export default exceptionFilter;
