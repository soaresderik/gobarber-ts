import Controller from "./Controller";
import { Request, Response } from "express";
import NotFoundException from "../exceptions/NotFoundException";
import HttpException from "../exceptions/HttpException";

import * as jwt from "jsonwebtoken";
import * as wrapper from "express-async-handler";
import User from "../../entity/User";
import authConfig from "../config/auth.config";
import authMiddleware from "../middlewares/auth.middleware";
import { IRequest } from "../interfaces/custom.interfaces";
import AuthorizationException from "../exceptions/AuthorizationException";
import validationMiddleware from "../middlewares/validation.middleware";
import UpdateUserDTO from "./dto/updataUser.dto";
import File from "../../entity/File";
import { UserRepository } from "../models/UserRepository";

export default class SessionController extends Controller {
  private userRepository = new UserRepository();

  constructor() {
    super();
    this.path = "/sessions";

    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(this.path, wrapper(this.store));
    this.router.put(
      this.path,
      [authMiddleware, validationMiddleware(UpdateUserDTO, true)],
      wrapper(this.update)
    );
  }

  public store = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      relations: ["avatar"]
    });

    if (!user) throw new NotFoundException("User");

    if (!(await user.checkPassword(password)))
      throw new HttpException(401, "Não autorizado!");

    const { id, name } = user;
    const avatar = user.avatar
      ? {
          id: user.avatar.id,
          url: user.avatar.url
        }
      : null;

    return res.json({
      user: {
        id,
        name,
        email,
        avatar
      },
      token: await jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expires
      })
    });
  };

  public update = async (req: IRequest, res: Response) => {
    const { email, oldPassword, password, name, avatarId } = req.body;
    const user = await User.findOne(req.user.id);

    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) throw new HttpException(400, "User already exists.");
    }

    if (oldPassword && !(await user.checkPassword(oldPassword)))
      throw new AuthorizationException("Password does not match");

    if (avatarId) {
      user.avatar = null;
      await user.save();
      const avatar = await File.findOne(avatarId);

      user.avatar = avatar;
    }

    if (password) user.password = await user.updatePassword(password);
    user.name = name;
    user.email = email;

    await user.save();

    const updated = await this.userRepository.findOneUser(user.id);

    res.json({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      provider: updated.provider,
      avatar: updated.avatar || null
    });
  };
}
