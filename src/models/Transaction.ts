import { Schema, model } from "mongoose";

const TransactionSchema = new Schema(
  {
    buyer: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    products: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "ProductInstance",
      },
    ],
    paymentMethod: { type: String, required: true },
    totalPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

export = model("Transaction", TransactionSchema);
