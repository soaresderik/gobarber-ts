import HttpException from "./HttpException";

export default class AuthorizationException extends HttpException {
  constructor(message: string) {
    super(401, message);
  }
}
