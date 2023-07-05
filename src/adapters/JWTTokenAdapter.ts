import { sign, verify } from "jsonwebtoken";
import { TokenGenerator } from "./TokenAdapter";

class JWTTokenAdapter implements TokenGenerator {
  public generateToken(id: string): string {
    return sign({ id }, "123", {
      expiresIn: "7d",
    });
  }

  public read(token: string): DecodeToken {
    return verify(token, "123") as DecodeToken;
  }

  private uncapsulate(token: string): string {
    return token.split(" ")[1];
  }
}

export default new JWTTokenAdapter();
