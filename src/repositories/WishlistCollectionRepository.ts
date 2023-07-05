import { SessionOption, Types } from "mongoose";
import WishlistCollection from "../models/WishlistCollection";
import { Injectable } from "@nestjs/common";

@Injectable()
export class WishlistCollectionRepository {
  /**
   * Create a wishlist collection with given data.
   * @param collectionData Data containing name, user and privated status.
   */
  public async createCollection(collectionData: CollectionDTO): Promise<void> {
    await WishlistCollection.create(collectionData);
  }

  /**
   * Update a collection with given collection id.
   * @param collectionId Valid collection ObjectId.
   * @param collectionData Object containing the data to be updated.
   */
  public async updateCollectionDetails(
    collectionId: string,
    collectionData: CollectionDTO
  ): Promise<void> {
    await WishlistCollection.findByIdAndUpdate(collectionId, collectionData);
  }

  /**
   * Delete a collection with given collection id.
   * @param collectionId Valid collection ObjectId.
   */
  public async deleteCollection(
    collectionId: string,
    session?: SessionOption
  ): Promise<void> {
    await WishlistCollection.findByIdAndDelete(
      collectionId,
      session ? session : undefined
    );
  }

  /**
   * Get a collection with given collection id.
   * @param collectionId Valid collection ObjectId.
   * @returns Returns an object containing collection details.
   */
  public async getCollectionById(
    collectionId: string
  ): Promise<Collection | null> {
    return await WishlistCollection.findById(collectionId);
  }

  /**
   * Get every collection from a user, including privated.
   * @param userId Valid user ObjectId.
   * @returns Returns an array of wishlist collections id.
   */
  public async getEveryCollectionsByUserId(
    userId: string
  ): Promise<Collection[]> {
    return await WishlistCollection.find({
      user: new Types.ObjectId(userId),
    });
  }

  /**
   * Get public collections from a user.
   * @param userId Valid user ObjectId.
   * @returns Returns an array of wishlist collections id.
   */
  public async getPublicCollectionsByUserId(
    userId: string
  ): Promise<Collection[]> {
    return await WishlistCollection.find({
      user: new Types.ObjectId(userId),
      privated: false,
    });
  }
  /**
   * Get collection by given name from a user.
   * @param userId Valid user ObjectId.
   * @param name Collection name.
   * @returns Returns an object of the found collection.
   */
  public async getCollectionByNameFromUser(
    userId: string,
    name: string
  ): Promise<Collection | null> {
    return await WishlistCollection.findOne({
      user: new Types.ObjectId(userId),
      name,
    });
  }
}
