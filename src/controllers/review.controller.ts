import { Controller, Delete, Get, Patch, Post, Req } from "@nestjs/common";
import { ReviewService } from "../services/Review.service";
import { Request } from "express";

@Controller("api/review")
export class ReviewController {
  constructor(private reviewService: ReviewService) {}
  /**
   * GET - Get a review with given valid ObjectId.
   * @param {Request} request - The HTTP request object containing the review ID.
   * @throws throws error if review id isn't valid or if the review has not been found.
   */
  @Get("/:id")
  async getReview(@Req() request: Request) {
    return this.reviewService.getReview(request);
  }

  /**
   * POST, AUTH REQUIRED - Create a review instance with given data.
   * @param {Request} request - The HTTP request object containing the user ID, text, score, productOwner ID and product ID.
   * @throws throws error if body isn't valid or if review author has not been found.
   */
  @Post("/")
  async submitReview(@Req() request: Request) {
    await this.reviewService.submitReview(request);
    return { message: "Análise Publicada." };
  }

  /**
   * DELETE, AUTH REQUIRED - Delete a review instance with given valid ObjectId id.
   * @param {Request} request - The HTTP request object containing the user and review ID.
   * @throws throws error if review author, review author is different from request user or if the review has not been found.
   */
  @Delete("/:id")
  async deleteReview(@Req() request: Request) {
    await this.reviewService.deleteReview(request);
    return { message: "Análise Excluida." };
  }

  /**
   * PATCH, AUTH REQUIRED - Update a review instance with given valid ObjectId id and data.
   * @param {Request} request - The HTTP request object containing the user and review ID, score and text.
   * @throws throws error if review author, review author is different from request user or if the review has not been found.
   */
  @Patch("/:id")
  async updateReview(@Req() request: Request) {
    await this.reviewService.updateReview(request);
    return { message: "Análise Atualizada." };
  }
}
