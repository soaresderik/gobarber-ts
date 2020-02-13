import * as multer from "multer";
import * as crypto from "crypto";
import { extname, resolve } from "path";

export default {
  storage: multer.diskStorage({
    destination: resolve("tmp", "uploads"),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) console.log(err);

        return cb(null, res.toString("hex") + extname(file.originalname));
      });
    }
  })
};
