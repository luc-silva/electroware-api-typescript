import { HttpException } from "@nestjs/common";

export class NotAuthorizedException extends HttpException {
  constructor(msg: string) {
    super(msg, 401);
  }
}
