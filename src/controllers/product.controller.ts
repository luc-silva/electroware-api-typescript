import { Controller, Delete, Get, Post, Put, Req } from "@nestjs/common";
import { Request } from "express";

import { ReviewService } from "../services/Review.service";
import { ProductService } from "../services/Product.service";

@Controller("api/product")
export class ProductController {
  constructor(
    private reviewService: ReviewService,
    private productService: ProductService
  ) {}

  /**
   * GET - Get twelve most recent products.
   * @param {Request} request - HTTP request doesn't need any parameters.
   * @throws throws error if any product has been found.
   */
  @Get("/")
  async getRecentProducts(@Req() request: Request) {
    return await this.productService.getRecentProducts(request);
  }

  /**
   * GET - Get every products that have an active discount.
   * @param {Request} request - HTTP request doesn't need any parameters.
   * @param {Response} response - The HTTP response object containing products IDs.
   */
  @Get("/discount")
  async getProductsOnSale(@Req() request: Request) {
    return await this.productService.getDiscountedProducts(request);
  }

  /**
   * GET - Get product score with given valid ObjectId.
   * @param {Request} request - The HTTP request containing the product id.
   * @throws throws error if any product has been found.
   */
  @Get("/:id/reviews/score")
  async getProductRating(@Req() request: Request) {
    return await this.productService.getProductRating(request);
  }

  /**
   * POST - Search for a product with given valid keyword.
   * @param {Request} request - The HTTP request containing product keyword.
   * @throws throws error if receives invalid data.
   */
  @Post("/search/:keyword")
  async searchProduct(@Req() request: Request) {
    return this.productService.searchProduct(request);
  }

  /**
   * GET - Get product details with given valid ObjectId.
   * @param {Request} request - The HTTP request containing product id.
   * @throws throws error if receives invalid data, if a product has not been found or if a product image has not been found.
   */
  @Get("/:id")
  async getProductDetails(@Req() request: Request) {
    return await this.productService.getProductDetails(request);
  }

  /**
   * POST, AUTH REQUIRED - Create a product with given data.
   * @param {Request} request - The HTTP request object containing user, name, price, category, quantity, description and brand.
   * @throws throws error if receives a invalid data or if a user has not been found.
   */
  @Post("/create")
  async createProduct(@Req() request: Request) {
    return await this.productService.createProduct(request);
  }

  /**
   * PUT, AUTH REQUIRED - Update a product with given data.
   * @param {Request} request - The HTTP request object containing user, name, price, category, quantity, description and brand.
   * @throws throws error if receives a invalid data or if a user has not been found.
   */
  @Put("/:id")
  async updateProduct(@Req() request: Request) {
    await this.productService.updateProduct(request);
    return { message: "Produto Atualizado." };
  }

  /**
   * DELETE, AUTH REQUIRED - Delete product with given valid ObjectId.
   * @param {Request} request - The HTTP request object containing product id.
   * @throws throws error if receives a invalid data, if the product owner is different from request user, or if a user has not been found.
   */
  @Delete("/:id")
  async deleteProduct(@Req() request: Request) {
    await this.productService.deleteProduct(request);
    return { message: "Produto excluido" };
  }

  /**
   * GET - Get product reviews with given valid ObjectId.
   * @param {Request} request - The HTTP request object containing the product ID.
   * @throws throws error if product id isn't valid or if the product has not been found.
   */
  @Get("/:id/reviews")
  async getProductReviews(@Req() request: Request) {
    return await this.reviewService.getProductReviews(request);
  }
}
