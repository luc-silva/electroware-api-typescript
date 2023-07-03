class WishlistCollectionValidator {
  public checkCreate(request_body: CollectionDTO): void {
    this.validateName(request_body.name);
    this.validateVisibility(request_body.privated);
  }

  private validateName(name: string) {
    if (typeof name !== "string") {
      throw new Error("Campo nome inválido.");
    }
  }

  private validateVisibility(status: boolean) {
    if (typeof status !== "boolean") {
      throw new Error("Campo visibilidade inválido.");
    }
  }
}
export default new WishlistCollectionValidator();
