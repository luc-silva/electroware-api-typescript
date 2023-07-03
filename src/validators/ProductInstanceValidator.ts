import { checkIfValidId } from "../utils/operations";

class ProductInstanceValidator {
  public checkCreate(request_body: CartItemDTO) {
    this.validateUser(request_body.user);
    this.valdiateQuantity(request_body.quantity);
    this.validateProduct(request_body.product);
    this.validatePrice(request_body.price);
  }

  private validateUser(user: string) {
    if (!user || typeof user !== "string" || !checkIfValidId(user)) {
      throw new Error("Campo usuário inválido.");
    }
  }
  private validateProduct(product: string) {
    if (!product || typeof product !== "string" || !checkIfValidId(product)) {
      throw new Error("Campo produto inválido.");
    }
  }
  private validatePrice(price: number) {
    if (!price || typeof price !== "number") {
      throw new Error("Campo preço inválido.");
    }
  }
  private valdiateQuantity(quantity: number) {
    if (!Number.isInteger(quantity)) {
      throw new Error("Campo quantidade inválido.");
    }
  }
}

export default new ProductInstanceValidator();
