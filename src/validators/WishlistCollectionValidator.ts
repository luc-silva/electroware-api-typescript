import { Response } from "express";
import { ICollectionData, Validator } from "../../interface";

class WishlistCollectionValidator implements Validator {
  public validate(response: Response, requestBody: ICollectionData): void {
    const { name, privated } = requestBody;
    if (typeof name !== "string") {
      response.status(400);
      throw new Error("Campo nome inválido.");
    }

    /*         if (!Types.ObjectId.isValid(user)) {
            response.status(400);
            throw new Error("Usuário Inválido.");
        } */

    if (typeof privated !== "boolean") {
      response.status(400);
      throw new Error("Campo visibilidade Inválido.");
    }
  }
}
export default new WishlistCollectionValidator();
