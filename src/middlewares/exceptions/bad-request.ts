import HttpException from "../../utils/http-exception";

class BadRequest extends HttpException {
  constructor(error: { message: string; errorCode?: string; data?: any }) {
    super(200, error.message, error.errorCode, error.data);
  }
}

export default BadRequest;
