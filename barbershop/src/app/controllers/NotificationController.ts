import Notification from "../schemas/Notification";
import Controller from "./Controller";
import * as wrapper from "express-async-handler";
import auth from "../middlewares/auth.middleware";
import { IRequest } from "../interfaces/custom.interfaces";
import { Response } from "express";
import User from "../../entity/User";
import AuthorizationException from "../exceptions/AuthorizationException";

export default class NotificationController extends Controller {
  constructor() {
    super();
    this.path = "/notifications";
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.put(`${this.path}/:id`, [auth], wrapper(this.update));
    this.router.get(this.path, [auth], wrapper(this.index));
  }

  public index = async (req: IRequest, res: Response) => {
    const provider = await User.findOne({
      where: { id: req.user.id, provider: true }
    });

    if (!provider)
      throw new AuthorizationException("Only provider can load notifications.");

    const notifications = await Notification.find({
      user: req.user.id
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(notifications);
  };

  public update = async (req: IRequest, res: Response) => {
    console.log(req.params);
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    res.json(notification);
  };
}
