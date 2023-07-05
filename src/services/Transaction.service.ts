import TransactionValidator from "../validators/TransactionValidator";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { NotAuthorizedException } from "../exceptions/NotAuthorizedException";
import { getTotalFromProducts } from "../utils/operations";
import { Request } from "express";

import { UserRepository } from "../repositories/UserRepository";
import { CartItemRepository } from "../repositories/CartItemRepository";
import { TransactionRepository } from "../repositories/TransactionRepository";

@Injectable()
export class TransactionService {
  constructor(
    private userRepository: UserRepository,
    private cartItemRepository: CartItemRepository,
    private transactionRepository: TransactionRepository
  ) {}

  async createProductTransaction(request: Request) {
    if (!request.body || !request.user) {
      throw new BadRequestException("Dados inválidos");
    }

    const user = await this.userRepository.getUserById(request.user.id);
    if (!user) {
      throw new NotFoundException("Usuário não encontrado.");
    }

    try {
      TransactionValidator.checkCreate(request.body);
    } catch (e: any) {
      throw new BadRequestException(e.message);
    }

    const { paymentMethod } = request.body;
    const productsBought = await this.cartItemRepository.getCartItemsByUser(
      user.id as string
    );
    if (productsBought.length === 0) {
      throw new Error("Não há produtos no carrinhos de compras.");
    }

    const total = getTotalFromProducts(productsBought);

    if (user.funds < total) {
      throw new BadRequestException("Fundos insuficientes.");
    }
    const data = {
      paymentMethod,
      products: productsBought,
      totalPrice: total,
    };

    await this.transactionRepository.createTransactionItem(
      user.id as string,
      data
    );
  }

  async getUserTransactions(request: Request) {
    if (!request.user || !request.params) {
      throw new BadRequestException("Dados inválidos.");
    }

    const user = await this.userRepository.getUserById(request.user.id);
    if (!user) {
      throw new NotFoundException("Usuário não encontrado.");
    }

    if (user.id !== request.params.id) {
      throw new NotAuthorizedException("Não autorizado.");
    }

    return await this.transactionRepository.getTrasactionItemsByBuyer(user.id);
  }
}
