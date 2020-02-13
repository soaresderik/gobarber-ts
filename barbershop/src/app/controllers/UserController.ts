import { UserRepository } from "../models/UserRepository";
import { Request, Response } from "express";
import Controller from "./Controller";
import * as wrapper from "express-async-handler";
import validationMiddleware from "../middlewares/validation.middleware";
import UserDTO from "./dto/user.dto";

export default class UserController extends Controller {
  private userRepository = new UserRepository();

  constructor() {
    super();
    this.path = "/users";
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      this.path,
      validationMiddleware(UserDTO),
      wrapper(this.store)
    );
  }

  public store = async (req: Request, res: Response) => {
    const user = await this.userRepository.createUser(req.body);

    res.json(user);
  };
}
