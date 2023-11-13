import { response, Response } from "express";

response.customSuccess = function (
  status,
  data: any,
  message: string = "Success",
  errorCode: string = ""
) {
  return this.status(status).json({
    success: true,
    status,
    message,
    data,
    errorCode,
  });
};
