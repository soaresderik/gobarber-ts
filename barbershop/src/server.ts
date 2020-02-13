import "dotenv/config";
import App from "./app";
import { createConnection } from "typeorm";

import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";
import FileController from "./app/controllers/FileController";
import ProviderController from "./app/controllers/ProviderController";
import AppointmentController from "./app/controllers/AppointmentController";
import ScheduleController from "./app/controllers/ScheduleController";
import NotificationController from "./app/controllers/NotificationController";
import AvailableController from "./app/controllers/AvailableController";

(async () => {
  try {
    await createConnection({
      type: "postgres",
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: ["./src/entity**/*.ts"],
      synchronize: true,
      logging: false
    });
  } catch (error) {
    console.log("Error while connecting to the database", error);
    return error;
  }

  const app = new App(
    [
      new UserController(),
      new SessionController(),
      new FileController(),
      new ProviderController(),
      new AppointmentController(),
      new ScheduleController(),
      new NotificationController(),
      new AvailableController()
    ],
    3333
  );
  app.listen();
})();
