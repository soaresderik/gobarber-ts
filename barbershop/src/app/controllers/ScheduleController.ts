import Controller from "./Controller";
import { Request, Response } from "express";
import * as wrapper from "express-async-handler";
import auth from "../middlewares/auth.middleware";
import { IRequest } from "../interfaces/custom.interfaces";
import { UserRepository } from "../models/UserRepository";
import User from "../../entity/User";
import AuthorizationException from "../exceptions/AuthorizationException";
import Appointment from "../../entity/Appointment";
import { startOfDay, endOfDay, parseISO } from "date-fns";
import { Between } from "typeorm";
import AppointmentRepository from "../models/AppointmentRepository";

export default class ScheduleController extends Controller {
  constructor(private appointmentRepo = new AppointmentRepository()) {
    super();
    this.path = "/schedule";

    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, [auth], wrapper(this.index));
  }

  public index = async (req: IRequest, res: Response) => {
    const checkProfider = await User.findOne({
      where: { id: req.user.id, provider: true }
    });

    if (!checkProfider)
      throw new AuthorizationException("User is not a provider.");

    const { date } = req.query;
    const parsedDate = parseISO(date);

    const appointments = await this.appointmentRepo.getScheduleByProviderId(
      req.user.id,
      parsedDate
    );

    res.json({ appointments });
  };
}
