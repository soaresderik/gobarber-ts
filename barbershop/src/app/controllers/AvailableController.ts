import { Request, Response } from "express";
import Controller from "./Controller";
import * as wrapper from "express-async-handler";
import auth from "../middlewares/auth.middleware";
import { IRequest } from "../interfaces/custom.interfaces";
import HttpException from "../exceptions/HttpException";
import {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  format,
  isAfter
} from "date-fns";
import Appointment from "../../entity/Appointment";
import { Between } from "typeorm";

export default class AvailableController extends Controller {
  constructor() {
    super();
    this.path = "/providers";
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}/:providerId/available`,
      [auth],
      wrapper(this.index)
    );
  }

  public index = async (req: IRequest, res: Response) => {
    const { date } = req.query;

    if (!date) throw new HttpException(400, "Invalid date.");

    const searchDate = Number(date);

    const appointments = await Appointment.find({
      where: {
        providerId: req.params.providerId,
        canceledAt: null,
        date: Between(startOfDay(searchDate), endOfDay(searchDate))
      }
    });

    const schedule = [
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00"
    ];

    const available = schedule.map(time => {
      const [hour, minute] = time.split(":");
      const value = setSeconds(
        setMinutes(setHours(searchDate, +hour), +minute),
        0
      );

      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        available:
          isAfter(value, new Date()) &&
          !appointments.find(a => format(a.date, "HH:mm") === time)
      };
    });

    res.json(available);
  };
}
