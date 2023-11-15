import HttpException from "../../utils/http-exception";

class Authorization extends HttpException {
  constructor(error: { message: string; errorCode?: string; data?: any }) {
    super(403, error.message, error.errorCode, error.data);
  }
}

export default Authorization;
