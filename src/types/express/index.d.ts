declare namespace Express {
  interface Response {
    customSuccess(
      status: number,
      data?: any,
      message?: string,
      errorCode?: string
    ): Response;
  }
}
