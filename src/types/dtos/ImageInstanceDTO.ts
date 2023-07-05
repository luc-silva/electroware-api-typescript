interface ImageInstanceDTO {
  user: string;
  product?: string;
  data: Buffer;
  imageType: "productImage" | "userImage";
}
