import { startSession } from "mongoose";
import Product from "../models/Product";
import ProductInstance from "../models/ProductInstance";
import Transaction from "../models/Transaction";
import User from "../models/User";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TransactionRepository {
  /**
   * Create transaction item with given data.
   * @param userId - User ObjectId.
   * @param trasactionItemData Transaction data containing products, total value and payment method.
   */
  public async createTransactionItem(
    userId: string,
    trasactionItemData: TransactionItemDTO
  ): Promise<void> {
    const session = await startSession();
    await session.withTransaction(async () => {
      const data = {
        ...trasactionItemData,
        buyer: userId,
      };
      await Transaction.create([data], { session });

      await User.findByIdAndUpdate(
        [userId],
        { $inc: { funds: -trasactionItemData.totalPrice } },
        { session }
      );

      for (const productInstance of trasactionItemData.products) {
        await User.findByIdAndUpdate(
          [productInstance.seller],
          {
            $inc: {
              funds: +(productInstance.price * productInstance.quantity),
            },
          },
          { session }
        );
        await Product.findByIdAndUpdate(
          [productInstance.product],
          {
            $inc: {
              quantity: -productInstance.quantity,
              sales: productInstance.quantity,
            },
          },
          { session }
        );

        await ProductInstance.findByIdAndDelete(productInstance.id as string, {
          session,
        });
      }

      await session.commitTransaction();
    });
    session.endSession();
  }

  /**
   * Get transaction items with given buyer id.
   * @param objectId User ObjectId.
   * @returns Returns detailed transaction items.
   */
  public async getTrasactionItemsByBuyer(
    objectId: string
  ): Promise<TransactionItem[]> {
    return await Transaction.find({ buyer: objectId });
  }
}
