import HttpException from "../../utils/http-exception";

class Business extends HttpException {
  constructor(error: { message: string; errorCode?: string; data?: any }) {
    super(500, error.message, error.errorCode, error.data);
  }
}

export default Business;
