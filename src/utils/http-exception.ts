class HttpException extends Error {
  public success: boolean;
  public status: number;
  public message: string;
  public errorCode: string;
  public data: any;

  constructor(
    status: number,
    message: string,
    errorCode: string = "",
    data: any = null
  ) {
    super(message);
    this.status = status;
    this.message = message;
    this.success = false;
    this.data = data;
    this.errorCode = errorCode;
  }
}

export default HttpException;
