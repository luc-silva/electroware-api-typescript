//this enum isnt being converted to a js object idk why
enum PaymentOptions {
  bankSlip = "Boleto",
  creditCard = "Cartão de Crédito",
  bitcoin = "Bitcoin",
  pix = "Pix",
}

class TransactionValidator {
  public checkCreate(request_body: TransactionItemDTO): void {
    this.validatePaymentMethod(request_body.paymentMethod);
  }
  private validatePaymentMethod(payment_method: PaymentOptions) {
    if (
      (!payment_method && typeof payment_method !== "string") ||
      !Object.values(PaymentOptions).includes(payment_method)
    ) {
      throw new Error("Campo método de pagamento inválido.");
    }
  }
}

export default new TransactionValidator();
