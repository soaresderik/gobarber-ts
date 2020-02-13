import HttpException from "./HttpException";

export default class NotFoundException extends HttpException {
  constructor(object: string) {
    super(404, `${object} not found`);
  }
}
