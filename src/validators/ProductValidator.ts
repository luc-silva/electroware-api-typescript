import { checkIfValidId } from "../utils/operations";

class ProductValidator {
  private NAME_MAX_LENGTH = 30;
  private BRAND_MAX_LENGTH = 15;
  private DESCRIPTION_MAX_LENGTH = 200;
  private MAX_PRICE = 10000;
  private MAX_QUANTITY = 3000;

  public checkCreate(product_body: ProductDTO) {
    this.validateName(product_body.name);
    this.validatePrice(product_body.price);
    this.validateCategory(product_body.category);
    this.validateQuantity(product_body.quantity);
    this.validateDescription(product_body.description);
    this.validateBrand(product_body.brand);
    this.validateDiscount(product_body.discount);
  }

  private validateName(name: string) {
    if (name.length > this.NAME_MAX_LENGTH) {
      throw new Error("Campo nome inválido.");
    }
  }

  private validatePrice(price: number) {
    if (!price || price > this.MAX_PRICE) {
      throw new Error("Campo preço inválido.");
    }
  }

  private validateCategory(categoryId: string) {
    if (!checkIfValidId(categoryId)) {
      throw new Error("Campo categoria inválido.");
    }
  }

  private validateQuantity(quantity: number) {
    if (!Number.isInteger(quantity) || quantity > this.MAX_QUANTITY) {
      throw new Error("Campo quantidade inválido.");
    }
  }

  private validateDescription(description: string) {
    if (
      typeof description !== "string" ||
      description.length > this.DESCRIPTION_MAX_LENGTH
    ) {
      throw new Error("Campo descrição inválido.");
    }
  }

  private validateBrand(brand: string) {
    if (typeof brand !== "string" || brand.length > this.BRAND_MAX_LENGTH) {
      throw new Error("Campo marca inválido.");
    }
  }

  private validateDiscount(discount: number) {
    if (isNaN(discount)) {
      throw new Error("Campo disconto inválido");
    }
  }
}
export default new ProductValidator();
