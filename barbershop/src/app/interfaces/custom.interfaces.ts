import { Request } from "express";
import User from "../../entity/User";

export interface IRequest extends Request {
  user: User;
}

export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
}
