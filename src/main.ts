import { NestFactory } from "@nestjs/core";
import { connectDB } from "./middleware/db";
import { ServerModule } from "./server.module";

import express from "express";
import cors from "cors";
import dotenv from "dotenv" 

async function electroware() {
  await connectDB();
  const app = await NestFactory.create(ServerModule);

  dotenv.config()
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  await app.listen(6060);
}

electroware();
