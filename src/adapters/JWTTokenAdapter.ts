import { sign, verify } from "jsonwebtoken";
import { IDecodedUserToken } from "../../interface";
import { TokenGenerator } from "./TokenAdapter";

class JWTTokenAdapter implements TokenGenerator {
  public generateToken(id: string): string {
    return sign({ id }, "123", {
      expiresIn: "7d",
    });
  }

  public read(token: string): IDecodedUserToken {
    return verify(token, "123") as IDecodedUserToken;
  }
}

export default new JWTTokenAdapter();
