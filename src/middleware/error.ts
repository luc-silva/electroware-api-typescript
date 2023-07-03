import { Request, Response } from "express";

export const errorMiddleware = (
  err: Error,
  request: Request,
  response: Response,
  next: any
) => {
  response.status(response.statusCode < 400 ? 400 : response.statusCode);
  response.json({ message: err.message });
};
