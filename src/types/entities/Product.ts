interface Product extends Document {
  name: string;
  price: number;
  owner: string;
  id: string;
  category: string;
  quantity: number;
  description: string;
  brand: string;
  on_sale: boolean;
  discount: number;
}
