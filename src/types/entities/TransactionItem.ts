interface TransactionItem extends Document {
  paymentMethod: PaymentOptions;
  products: ProductInstance[];
  totalPrice: number;
}
