import { EntityRepository, Repository, getRepository } from "typeorm";
import Appointment from "../../entity/Appointment";
import { startOfDay, endOfDay, parseISO } from "date-fns";

@EntityRepository(Appointment)
export default class AppointmentRepository {
  constructor(private _db = getRepository(Appointment)) {}

  async findAppointmentsByUserId(userId: number, offset, limit = 20) {
    const appointments = await this._db
      .createQueryBuilder("appoint")
      .leftJoinAndSelect("appoint.provider", "provider")
      .leftJoinAndSelect("provider.avatar", "avatar")
      .select([
        "appoint.id",
        "appoint.date",
        "provider.id",
        "provider.name",
        "avatar.id",
        "avatar.path"
      ])
      .where("appoint.userId = :userId", { userId })
      .orderBy("appoint.createdAt", "DESC")
      .offset(offset)
      .limit(limit)
      .getMany();

    return appointments;
  }

  async getScheduleByProviderId(provierId, date) {
    const appointments = await this._db
      .createQueryBuilder("appoint")
      .leftJoinAndSelect("appoint.user", "user")
      .select(["appoint.id", "appoint.date", "appoint.canceledAt", "user.name"])
      .where("appoint.providerId = :provierId AND appoint.canceledAt IS NULL", {
        provierId
      })
      .andWhere("appoint.date BETWEEN :start AND :end", {
        start: startOfDay(date),
        end: endOfDay(date)
      })
      .orderBy("appoint.createdAt", "DESC")
      .getMany();

    return appointments;
  }
}
