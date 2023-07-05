interface CartItem extends Document {
  id: string;
  user: string;
  seller: string;
  product: string;
  price: number;
  quantity: number;
}
