import { SessionOption } from "mongoose";
import WishlistItem from "../models/WishlistItem";
import { Injectable } from "@nestjs/common";

@Injectable()
export class WishlistItemRepository {
  /**
   * Get wishlist item with given id.
   * @param objectId - Wishlist item ObjectId.
   * @returns Return wishlist item details object.
   */
  public async getWishlistItem(objectId: string): Promise<WishlistItem | null> {
    return await WishlistItem.findById(objectId);
  }

  /**
   * Get wishlist items with given user id.
   * @param objectId - User ObjectId.
   * @returns Returns wishlist item details object.
   */
  public async getWishlistItemsByUser(
    objectId: string
  ): Promise<WishlistItem[]> {
    return await WishlistItem.find({ user: objectId });
  }

  /**
   * Get wishlist items with given collection id.
   * @param objectId - Collection ObjectId.
   * @returns Returns wishlist item details object.
   */
  public async getWishlistItemsByCollection(
    objectId: string
  ): Promise<WishlistItem[]> {
    return await WishlistItem.find({ group: objectId });
  }

  /**
   * Get wishlist item with given collection, product and user ids.
   * @param userId - User ObjectId.
   * @param productId - Product ObjectId.
   * @param collectionId - Product ObjectId.
   * @returns Returns wishlist item details object.
   */
  public async getWishlistItemByUserProductAndCollection(
    userId: string,
    productId: string,
    collectionId: string
  ): Promise<WishlistItem | null> {
    return await WishlistItem.findOne({
      user: userId,
      product: productId,
      group: collectionId,
    });
  }

  /**
   * Delete wishlist item with given id.
   * @param objectId Wishlist item ObjectId
   */
  public async deleteWishlistItem(objectId: string): Promise<void> {
    await WishlistItem.findByIdAndDelete(objectId);
  }

  /**
   * Delete wishlist item with given collection id.
   * @param objectId Collection ObjectId.
   */
  public async deleteWishlistItemsByCollection(
    objectId: string,
    session?: SessionOption
  ): Promise<void> {
    await WishlistItem.deleteMany(
      { group: objectId },
      session ? session : undefined
    );
  }

  /**
   * Create wishlist item with given user id and data.
   * @param userId - User ObjectId.
   * @param itemData - Item data such as product id and group.
   */
  public async createWishlistItem(
    userId: string,
    itemData: { id: string; group: string; product: string }
  ): Promise<void> {
    await WishlistItem.create({ ...itemData, user: userId });
  }
}
