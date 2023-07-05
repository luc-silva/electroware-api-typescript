import { Controller, Get, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { TransactionService } from "../services/Transaction.service";

@Controller("api/transaction")
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  /**
   * POST, AUTH REQUIRED - Create a transaction instance with given data.
   * @param {Request} request - The HTTP request object containing the user ID and payment method.
   * @throws throws error if user id isn't valid, if user has not been found or if user doesn't have required credit amount.
   */
  @Post("/")
  async createProductTransaction(@Req() request: Request) {
    await this.transactionService.createProductTransaction(request);
    return { message: "Compra Concluida." };
  }
}
