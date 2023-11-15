import HttpException from "../../utils/http-exception";

class CustomError extends HttpException {
  constructor(error: {
    status: number;
    message: string;
    errorCode?: string;
    data?: any;
  }) {
    super(error.status, error.message, error.errorCode, error.data);
  }
}

export default CustomError;
