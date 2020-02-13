import { Request, Response } from "express";
import Controller from "./Controller";
import * as wrapper from "express-async-handler";
import validationMiddleware from "../middlewares/validation.middleware";
import User from "../../entity/User";
import authMiddleware from "../middlewares/auth.middleware";
import { UserRepository } from "../models/UserRepository";

export default class ProviderController extends Controller {
  private userRepository = new UserRepository();
  private uploads;
  constructor() {
    super();
    this.path = "/providers";
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, authMiddleware, wrapper(this.index));
  }

  public index = async (req: Request, res: Response) => {
    const providers = await this.userRepository.findProviders();

    res.json(providers);
  };
}
