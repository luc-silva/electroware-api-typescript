import { Types } from "mongoose";

class CategoryValidator {
  public checkId(data: string) {
    this.validateId(data);
  }

  private validateId(str: string) {
    if (!Types.ObjectId.isValid(str)) {
      throw new Error("Id inválido.");
    }
  }
}

export default new CategoryValidator();
