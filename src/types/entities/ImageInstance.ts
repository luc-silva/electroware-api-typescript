interface ImageInstance extends Document {
  id: string;
  user: string;
  product?: string;
  data: Buffer;
  imageType: "productImage" | "userImage";
}
