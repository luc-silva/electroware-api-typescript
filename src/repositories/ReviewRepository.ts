import { Injectable } from "@nestjs/common";
import Review from "../models/Review";
import { Types } from "mongoose";

@Injectable()
export class ReviewRepository {
  /**
   * Get review detailswith given id.
   * @param objectId Review ObjectId.
   * @returns Returns review details object.
   */
  public async getReviewById(objectId: string): Promise<Review | null> {
    return Review.findById(objectId);
  }

  /**
   * Get a review with given id and populate author field.
   * @param objectId - Review ObjectId.
   * @returns Returns Review details object.
   */
  public async getReviewByIdAndPopulate(
    objectId: string
  ): Promise<Review | null> {
    return await Review.findById(objectId).populate("author", { name: 1 });
  }

  /**
   * Get reviews IDs and its author IDs from a product with given id and sort by the most recent.
   * @param objectId - Product ObjectId.
   * @returns Returns reviews and reviews authors IDs.
   */
  public async getProductReviews(
    objectId: string
  ): Promise<{ id?: string; author: Types.ObjectId }[]> {
    return await Review.find({ product: new Types.ObjectId(objectId) })
      .select({ id: 1, author: 1 })
      .sort({
        createdAt: -1,
      });
  }

  /**
   * Get reviews ids made by user with given id.
   * @param objectId User ObjectId.
   * @returns Returns IDs of reviews.
   */
  public async getReviewsMadeByUser(
    objectId: string
  ): Promise<{ id?: string }[]> {
    return await Review.find({ author: objectId }).select({ id: 1 });
  }

  /**
   * Get every reviews on products of a user.
   * @param objectId User ID.
   * @returns Returns a array of reviews score.
   */
  public async getEveryReviewFromUserProducts(
    objectId: string
  ): Promise<{ score: number }[]> {
    return Review.find({ productOwner: objectId }).select({
      score: 1,
    });
  }

  /**
   *Create a new review with given author id and data.
   * @param authorId User ObjectId.
   * @param reviewData Review data such as score, text and product.
   */
  public async createReview(
    authorId: string,
    reviewData: ReviewDTO
  ): Promise<void> {
    await Review.create({ ...reviewData, author: authorId });
  }

  /**
   * Delete review with given id.
   * @param objectId Review ObjectId.
   */
  public async deleteReview(objectId: string): Promise<void> {
    await Review.findByIdAndDelete(objectId);
  }

  /**
   * Update review with given id and data.
   * @param objectId Review ObjectId.
   * @param updatedReviewData Updated data such as text and score.
   */
  public async updateReview(
    objectId: string,
    updatedReviewData: { text: string; score: number }
  ): Promise<void> {
    await Review.findByIdAndUpdate(objectId, updatedReviewData);
  }
}
