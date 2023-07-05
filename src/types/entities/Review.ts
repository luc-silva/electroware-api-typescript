interface Review extends Document {
  id: string;
  author: string;
  product: string;
  productOwner: string;
  score: number;
  text: string;
}
