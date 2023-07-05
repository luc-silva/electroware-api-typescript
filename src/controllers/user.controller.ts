import { Controller, Delete, Get, Patch, Post, Put, Req } from "@nestjs/common";
import { UserService } from "../services/User.service";
import { Request } from "express";
import { ReviewService } from "../services/Review.service";
import { TransactionService } from "../services/Transaction.service";

@Controller("api/user")
export class UserController {
  constructor(
    private userService: UserService,
    private reviewService: ReviewService,
    private transactionService: TransactionService
  ) {}

  /**
   * POST - Log in user if given email and password.
   * @param {Request} request - The HTTP request object containing the email and password.
   * @throws throws error if there's no user with given email or wrong credentials
   */
  @Post("/login")
  async loginUser(@Req() request: Request) {
    return await this.userService.login(request);
  }

  /**
   * POST - Register user with given data.
   * @param {Request} request - The HTTP request object containing the email, password, name and location objects.
   * @throws throws error if there's already a user with given email or with the data isn't valid.
   */
  @Post("/register")
  async registerUser(@Req() request: Request) {
    await this.userService.register(request);
    return { message: "Usuário Criado." };
  }

  /**
   * PATCH, AUTH REQUIRED - Updates the user password with given password.
   * @param {Request} request - The HTTP request object containing the passwords.
   * @throws throws error if no user has been found or if the given password isn't valid.
   */
  @Patch("/private/details/password")
  async updateUserPassword(@Req() request: Request) {
    await this.userService.updatePassword(request);
    return { message: "Senha Atualizada." };
  }

  /**
   * PATCH, AUTH REQUIRED - Updates the user email with given data.
   * @param {Request} request - The HTTP request object containing the email.
   * @throws throws error if no user has been found or if the given email isn't valid.
   */
  @Patch("/private/details/email")
  async updateUserEmail(@Req() request: Request) {
    await this.userService.updateEmail(request);
    return { message: "Email Atualizado." };
  }

  /**
   * GET - Get user profile information with given valid ObjectId.
   * @param {Request} request - The HTTP request object containing the user ID.
   * @throws throws error if no user has been found or if the user id isn't valid.
   */
  @Get("/:id")
  async getProfileInfo(@Req() request: Request) {
    return await this.userService.getInfo(request);
  }

  /**
   * GET - Get user products IDs with given valid ObjectId.
   * @param {Request} request - The HTTP request object containing the user id.
   * @throws throws error if no user has been found or if the user id isn't valid.
   */
  @Get("/:id/products")
  async getUserProducts(@Req() request: Request) {
    return await this.userService.getProducts(request);
  }

  /**
   * GET - Get reviews from a product where the user is the owner with given valid user ObjectId.
   * @param {Request} request - The HTTP request object containing the user ID.
   * @throws throws error if user id isn't valid or if the user has not been found.
   */
  @Get("/:id/products/reviews")
  async getReviewsFromUserProducts(@Req() request: Request) {
    return await this.reviewService.getReviewsFromUserProducts(request);
  }

  /**
   * GET - Get every user reviews made with given valid user ObjectId.
   * @param {Request} request - The HTTP request object containing the user ID.
   * @throws throws error if user id isn't valid or if the user has not been found.
   */
  @Get("/:id/reviews")
  async getEveryUserReviews(@Req() request: Request) {
    return await this.reviewService.getEveryUserReviews(request);
  }

  /**
   * GET, AUTH REQUIRED - Get user profile private information with given valid ObjectId.
   *
   * @param {Request} request - The HTTP request object containing the user ID.
   * @throws throws error if no user has been found, if the private info ins't from the request user or if the user id isn't valid.
   */
  @Get("/private/:id")
  async getUserPrivateInfo(@Req() request: Request) {
    return await this.userService.getPrivateInfo(request);
  }

  /**
   * POST, AUTH REQUIRED - Increase the user balance with given amount.
   * @param {Request} request - The HTTP request object containing the user ID.
   * @throws throws error if no user has been found, or if the amount isn't valid.
   */
  @Post("/billings/add")
  async addFunds(@Req() request: Request) {
    await this.userService.addFunds(request);
    return { message: "Valor Adicionado." };
  }

  /**
   * DELETE, AUTH REQUIRED - Delete user account and associated info with given valid ObjectId.
   *
   * @param {Request} request - The HTTP request object containing the user ID.
   * @throws throws error if no user has been found, if the request user ID is different from the user ID or if the user ID isn't valid.
   */
  @Delete("/:id")
  async deleteAccount(@Req() request: Request) {
    await this.userService.deleteAccount(request);
    return { message: "Conta Excluida." };
  }

  /**
   * PUT, AUTH REQUIRED - Update user account details with given data and valid ObjectId.
   * @param {Request} request - The HTTP request object containing the user ID and data.
   * @throws throws error if any field expect from the body isn't valid, if not user has been found or if the request user id is different from user ID.
   */
  @Put("/:id")
  async updateUserInfo(@Req() request: Request) {
    await this.userService.updateInfo(request);
    return { message: "Feito." };
  }

  /**
   * GET, AUTH REQUIRED - Get every user transactions with given valid user id.
   * @param {Request} request - The HTTP request object containing the user ID.
   * @throws throws error if user id isn't valid, if user has not been found or if the request user ID is different from user id
   */
  @Get("/:id/transactions")
  async getUserTransactions(@Req() request: Request) {
    return await this.transactionService.getUserTransactions(request);
  }

  /**
   * GET, AUTH REQUIRED - Get every collection from a user.
   * @param  {Request} request The HTTP request object containing the user ID.
   * @throws throws error if the user has not been found.
   */
  @Get("/:id/private/collections")
  async getEveryUserCollectionOwned(@Req() request: Request) {
    return await this.userService.getEveryCollections(request);
  }

  /**
   * GET - Get every public collection from a user.
   * @param  {Request} request The HTTP request object containing the user ID.
   * @throws throws error if the user has not been found.
   */
  @Get("/:id/collections")
  async getUserPublicCollections(@Req() request: Request) {
    return await this.userService.getPublicCollections(request);
  }
}
