import { Schema, model } from "mongoose";

const WishlistItemSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product" },
    group: {
      type: Schema.Types.ObjectId,
      ref: "WishlistCollection",
      required: true,
    },
  },
  { timestamps: true }
);

export = model("WishlistItem", WishlistItemSchema);
