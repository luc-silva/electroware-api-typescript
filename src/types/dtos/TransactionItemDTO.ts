interface TransactionItemDTO {
  paymentMethod: PaymentOptions;
  products: CartItem[];
  totalPrice: number;
}
