import { Injectable } from "@nestjs/common";
import ProductInstance from "../models/ProductInstance";

@Injectable()
export class CartItemRepository {
  /**
   *  Get details of a shopping cart item.
   * @param objectId - Cart item ObjectId.
   * @returns Returns cart item details object.
   */
  public async getCartItem(objectId: string): Promise<CartItem | null> {
    return await ProductInstance.findById(objectId);
  }

  /**
   *Get details of a shopping cart item and populate seller, product and productImage fields.
   * @param objectId - Cart item ObjectId.
   * @returns Returns cart item details object.
   */
  public async getCartItemAndPopulate(
    objectId: string
  ): Promise<CartItem | null> {
    return await ProductInstance.findById(objectId)
      .select({ product: 1, price: 1, quantity: 1 })
      .populate("seller", { name: 1 })
      .populate("product", { id: 1, category: 1, name: 1, owner: 1 })
      .populate("productImage", { data: 1 });
  }

  /**
   *Get shopping cart item by given user and product IDs.
   *@param productId - Product ObjectId.
   *@param userId - User ObjectId.
   *@returns Returns cart item details object.
   */
  public async getCartItemByIdAndUser(
    productId: string,
    userId: string
  ): Promise<CartItem | null> {
    return await ProductInstance.findOne({
      product: productId,
      user: userId,
    });
  }

  /**
   * Get cart items by given user id.
   * @param objectId - User ObjectId.
   * @returns Returns cart item details object.
   */
  public async getCartItemsByUser(objectId: string): Promise<CartItem[] | []> {
    return await ProductInstance.find({ user: objectId });
  }

  /**
   *Create a shopping cart item with given data such as products, user, seller and price.
   * @param cartProductData - Object containing seller, product details and user.
   */
  public async createCartItem(cartProductData: CartItemDTO): Promise<void> {
    await ProductInstance.create(cartProductData);
  }

  /**
   *Delete shopping cart item with given id.
   * @param objectId - Cart item ObjectId.
   */
  public async deleteCartItem(objectId: string): Promise<void> {
    await ProductInstance.findByIdAndDelete(objectId);
  }
}
