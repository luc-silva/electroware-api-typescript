import { checkIfValidId } from "../utils/operations";

class ReviewValidator {
  private TEXT_LENGTH = 150;

  public checkCreate(request_body: ReviewDTO): void {
    this.validateAuthor(request_body.author);
    this.validateProduct(request_body.product);
    this.validateProductOwner(request_body.productOwner);
    this.validateScore(request_body.score);
    this.validateText(request_body.text);
  }

  public checkUpdate(request_body: ReviewDTO) {
    this.validateText(request_body.text);
    this.validateScore(request_body.score);
  }

  private validateAuthor(author: string) {
    if (!author || typeof author !== "string" || !checkIfValidId(author)) {
      throw new Error("Campo autor inválido.");
    }
  }
  private validateProduct(product: string) {
    if (!product || typeof product !== "string" || !checkIfValidId(product)) {
      throw new Error("Campo produto inválido.");
    }
  }
  private validateProductOwner(owner: string) {
    if (!owner || typeof owner !== "string" || !checkIfValidId(owner)) {
      throw new Error("Campo vendedor inválido.");
    }
  }
  private validateText(text: string) {
    if (typeof text !== "string" || text.length > this.TEXT_LENGTH) {
      throw new Error("Campo texto inválido.");
    }
  }
  private validateScore(score: number) {
    if ((!score && isNaN(score)) || score < 0 || score > 5) {
      throw new Error("Campo nota inválido.");
    }
  }
}
export default new ReviewValidator();
