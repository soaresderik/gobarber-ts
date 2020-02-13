import * as wrapper from "express-async-handler";
import Controller from "./Controller";
import validation from "../middlewares/validation.middleware";
import HttpException from "../exceptions/HttpException";
import auth from "../middlewares/auth.middleware";
import { Response, Request } from "express";
import { IRequest } from "../interfaces/custom.interfaces";
import { CreateAppoitmentDTO } from "./dto/appointment.dto";
import { startOfHour, parseISO, isBefore, format, subHours } from "date-fns";
import * as pt from "date-fns/locale/pt";
import AppointmentRepository from "../models/AppointmentRepository";
import { UserRepository } from "../models/UserRepository";

import Notification from "../schemas/Notification";
import Appointment from "../../entity/Appointment";
import AuthorizationException from "../exceptions/AuthorizationException";
import CancelationMail from "../jobs/CancelationMail";
import Queue from "../../lib/Queue";

export default class AppointmentController extends Controller {
  constructor(
    private userRepository = new UserRepository(),
    private appointmentRepo = new AppointmentRepository()
  ) {
    super();
    this.path = "/appointments";
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.delete(`${this.path}/:id`, [auth], wrapper(this.delete));
    this.router.get(this.path, [auth], wrapper(this.index));
    this.router.post(
      this.path,
      [auth, validation(CreateAppoitmentDTO)],
      wrapper(this.store)
    );
  }

  public index = async (req: IRequest, res: Response) => {
    const { page = 1 } = req.query;

    const limit = 20;
    const appointments = await this.appointmentRepo.findAppointmentsByUserId(
      req.user.id,
      (page - 1) * limit,
      limit
    );

    res.json(appointments);
  };

  public store = async (req: IRequest, res: Response) => {
    const { providerId, date } = req.body;

    if (providerId === req.user.id)
      throw new AuthorizationException("You can't do schedule for yourself.");

    const provider = await this.userRepository.findOneProvider(providerId);

    // Horários não permitidos
    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date()))
      throw new HttpException(400, "Past dates are not permitted.");

    // Checar data disponível
    const checkAvailability = await Appointment.findOne({
      where: {
        providerId,
        canceledAt: null,
        date: hourStart
      }
    });

    if (checkAvailability)
      throw new HttpException(401, "Appointment date not available");

    const appointment = await Appointment.create({
      userId: req.user.id,
      date: hourStart,
      provider
    }).save();

    // notificar provider
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      { locale: pt }
    );

    Notification.create({
      content: `Novo agendamendo de ${req.user.name} para ${formattedDate}`,
      user: providerId
    });

    res.json(appointment);
  };

  public delete = async (req: IRequest, res: Response) => {
    const appointment = await Appointment.findOne(req.params.id, {
      relations: ["provider", "user"]
    });

    if (appointment.userId !== req.user.id)
      throw new AuthorizationException(
        "You don't have permission to cancel this appointment."
      );

    const dateWithSub = subHours(appointment.date, 2);

    if (isBefore(dateWithSub, new Date()))
      throw new AuthorizationException(
        "You can only cancel appintments 2 hours in advence."
      );

    appointment.canceledAt = new Date();

    await appointment.save();

    await Queue.add(CancelationMail.key, {
      appointment
    });

    const { id, canceledAt } = appointment;

    res.json({ id, canceledAt });
  };
}
