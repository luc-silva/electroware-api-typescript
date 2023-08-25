import { Request, Response } from "express";

interface Validator {
  public validate(response: Response, requestBody: any): void;
}

//misc
declare global {
  namespace Express {
    interface Request {
      user: IUser;
      body: {
        name: string;
      };
    }
  }
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_CONNECTION_STRING: string;
    }
  }
}
