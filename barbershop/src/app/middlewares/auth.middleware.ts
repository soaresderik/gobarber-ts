import { NextFunction, Response } from "express";
import * as jwt from "jsonwebtoken";
import authConfig from "../config/auth.config";
import AuthorizationException from "../exceptions/AuthorizationException";
import User from "../../entity/User";
import { IRequest } from "../interfaces/custom.interfaces";

async function authMiddleware(
  req: IRequest,
  response: Response,
  next: NextFunction
) {
  const token = req.headers.authorization;
  if (token)
    try {
      const decoded = jwt.verify(token, authConfig.secret);
      const user = await User.findOne(decoded.id);
      if (user) {
        req.user = user;
        next();
      } else next(new AuthorizationException("Não autorizado."));
    } catch (error) {
      next(new AuthorizationException("Não autorizado."));
    }
  else next(new AuthorizationException("Token não reconhecido."));
}

export default authMiddleware;
