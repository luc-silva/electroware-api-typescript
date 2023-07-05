import { NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { extname } from "path";
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 4e6, //4 MB
  },
  fileFilter: (req, file, callback) => {
    const allowed = /jpg|png|jpeg/;
    const ext = allowed.test(extname(file.originalname));
    if (ext) {
      return callback(null, true);
    } else {
      callback(new Error("Imagem Inválida"));
    }
  },
}).single("imageField");

export class ImageUploader implements NestMiddleware {
  async use(request: Request, response: Response, next: NextFunction) {
    upload(request, response, (err) => {
      if (err) {
        response.status(400).json({ message: err.message });
      } else {
        next();
      }
    });
  }
}
