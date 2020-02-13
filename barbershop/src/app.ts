import "reflect-metadata";
import * as express from "express";
import * as path from "path";
import * as mongoose from "mongoose";
import * as Sentry from "@sentry/node";
import * as cors from "cors";
import sentryConfig from "./app/config/sentry.config";
import HttpException from "./app/exceptions/HttpException";
import Controller from "./app/controllers/Controller";

class App {
  private app: express.Application;
  private port: number;

  constructor(controllers: Controller[], port: number) {
    this.app = express();
    this.port = port;

    Sentry.init(sentryConfig);

    this.middlewares();
    this.initializeControllers(controllers);
    this.errorMiddleware();
    this.mongoConnect();
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(this.loggerMiddleware);
    this.app.use("/files", express.static(path.resolve("tmp", "uploads")));
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach(controller => {
      this.app.use("/", controller.router);
    });
  }

  private loggerMiddleware(
    request: express.Request,
    response: express.Response,
    next
  ) {
    console.log(`${request.method} ${request.path}`);
    next();
  }

  private async errorMiddleware() {
    this.app.use(
      async (
        error: HttpException,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        console.log(error);
        const message = error.message || "Something went wrong";
        const status = error.status || 500;
        res.status(status).json({ status, message });
      }
    );
  }

  private mongoConnect() {
    mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true
    });
  }

  public listen() {
    return this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}

export default App;
