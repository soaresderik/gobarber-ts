import { UserRepository } from "../models/UserRepository";
import { Request, Response } from "express";
import Controller from "./Controller";
import * as wrapper from "express-async-handler";
import * as multer from "multer";
import uploadConfig from "../config/multer";
import validationMiddleware from "../middlewares/validation.middleware";
import File from "../../entity/File";
import authMiddleware from "../middlewares/auth.middleware";

export default class FileController extends Controller {
  private uploads;
  constructor() {
    super();
    this.uploads = multer(uploadConfig);
    this.path = "/files";
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      this.path,
      [authMiddleware, this.uploads.single("file")],
      wrapper(this.store)
    );
  }

  public store = async (req: Request, res: Response) => {
    const { originalname: name, filename: path } = req.file;

    const file = await File.create({ name, path }).save();

    const result = await File.findOne(file.id);

    res.json(result);
  };
}
