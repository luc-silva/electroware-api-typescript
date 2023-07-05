import { Response, Request, NextFunction } from "express";
import User from "../models/User";
import JWTTokenAdapter from "../adapters/JWTTokenAdapter";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { NotAuthorizedException } from "../exceptions/NotAuthorizedException";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer")
    ) {
      throw new NotAuthorizedException("Não autorizado");
    }

    const token = req.headers.authorization.split(" ")[1];
    const decoded = JWTTokenAdapter.read(token);

    //set the user in the response and send to the next middleware
    const user = (await User.findById(decoded?.id)) as User;
    if (user && decoded?.id) {
      req.user = user;
    }
    next();
  }
}
