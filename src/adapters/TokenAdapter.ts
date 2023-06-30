import { IDecodedUserToken } from "../../interface";

export interface TokenGenerator {
  generateToken(str: any): string;
  read(item: any): IDecodedUserToken;
}
