import User from "../models/User";
import { startSession } from "mongoose";
import Product from "../models/Product";
import Review from "../models/Review";
import WishlistItem from "../models/WishlistItem";
import ProductInstance from "../models/ProductInstance";
import WishlistCollection from "../models/WishlistCollection";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserRepository {
  /**
   * Get user details without password and funds with given valid ObjectId.
   * @param objectId - User ObjectId.
   * @returns Returns user details object.
   */
  public async getUserById(
    objectId: string
  ): Promise<{ id?: string; funds: number } | null> {
    return await User.findById(objectId).select({ password: 0, funds: 0 });
  }

  /**
   * Get user password and email.
   * @param objectId - User ObjectId.
   * @returns Returns user details object.
   */
  public async getUserPrivateDetailsById(
    objectId: string
  ): Promise<{ id?: string; password: string; email: string } | null> {
    return await User.findById(objectId).select({ password: 1, email: 1 });
  }

  /**
   * Get user email and funds with given valid ObjectId.
   * @param objectId - User ObjectId.
   * @returns Returns user details object.
   */
  public async getUserEmailAndFundsById(
    objectId: string
  ): Promise<{ id?: string; funds: number; email: string } | null> {
    return await User.findById(objectId).select({ email: 1, funds: 1 });
  }

  /**
   * Get user information with given email.
   * @param email - Email used to log in.
   * @returns Returns user details object.
   */
  public async getUserInfoByEmail(email: string): Promise<User | null> {
    return await User.findOne({ email });
  }

  /**
   * Get user products with given product id.
   * @param objectId - User id.
   * @returns Returns user products IDs.
   */
  public async getUserProducts(objectId: string): Promise<{ id?: string }[]> {
    return await Product.find({ owner: objectId }).select({
      id: 1,
    });
  }

  /**
   * Create User with given data.
   * @param newUserData - User data such as name, location, email and hashed password.
   */
  public async createUser(newUserdata: User): Promise<void> {
    await User.create(newUserdata);
  }

  /**
   * update user details with given id.
   * @param objectId - User ObjectId.
   * @param updatedUserData - Data containg updated info such as location, name and description.
   */
  public async findUserAndUpdateDetails(
    objectId: string,
    updatedUserData: Partial<UserDTO>
  ): Promise<void> {
    await User.findByIdAndUpdate(objectId, updatedUserData);
  }

  /**
   * Delete user account and related items with given valid ObjectId.
   * @param objectId - User ObjectId.
   */
  public async deleteUserAccount(objectId: string): Promise<void> {
    const session = await startSession();
    await session.withTransaction(async () => {
      const user = await this.getUserById(objectId);
      if (user) {
        await Product.deleteMany(
          { owner: user.id },
          {
            session,
          }
        );
        await Review.deleteMany(
          { author: user.id },
          {
            session,
          }
        );
        await Review.deleteMany({ productOwner: user.id }, { session });
        await WishlistItem.deleteMany({ user: user.id }, { session });
        await WishlistCollection.deleteMany({ iser: user.id }, { session });

        await ProductInstance.deleteMany({ user: user.id }, { session });
        await ProductInstance.deleteMany({ seller: user.id }, { session });

        await User.deleteOne({ id: user.id }, { session });
      }
      await session.commitTransaction();
    });
    session.endSession();
  }

  /**
   * Delete user account and related items with given id.
   * @param objectId - User ObjectId.
   */
  public async addUserFunds(objectId: string, amount: number): Promise<void> {
    await User.findByIdAndUpdate(objectId, {
      $inc: { funds: +amount },
    });
  }
}
