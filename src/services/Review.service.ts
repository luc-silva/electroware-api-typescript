import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { NotAuthorizedException } from "../exceptions/NotAuthorizedException";

import { ReviewRepository } from "../repositories/ReviewRepository";
import { UserRepository } from "../repositories/UserRepository";
import { ProductRepository } from "../repositories/ProductRepository";

import { Request } from "express";
import ReviewValidator from "../validators/ReviewValidator";

@Injectable()
export class ReviewService {
  constructor(
    private reviewRepository: ReviewRepository,
    private userRepository: UserRepository,
    private productRepository: ProductRepository
  ) {}

  async getReview(request: Request) {
    if (!request.params) {
      throw new BadRequestException("Dados inválidos.");
    }

    const { id } = request.params;
    const review = await this.reviewRepository.getReviewByIdAndPopulate(id);
    if (!review) {
      throw new NotFoundException("Avaliação não encontrada.");
    }

    return review;
  }

  async getProductReviews(request: Request) {
    if (!request.params) {
      throw new BadRequestException("Dados inválidos.");
    }

    const { id } = request.params;
    const product = await this.productRepository.getProductDetails(id);
    if (!product) {
      throw new NotFoundException("Produto não encontrado.");
    }

    return await this.reviewRepository.getProductReviews(product.id);
  }

  async getEveryUserReviews(request: Request) {
    if (!request.params) {
      throw new BadRequestException("Dados inválidos.");
    }

    const { id } = request.params;

    const user = await this.userRepository.getUserById(id);
    if (!user) {
      throw new NotFoundException("Usuário não encontrado.");
    }

    return await this.reviewRepository.getReviewsMadeByUser(user.id as string);
  }

  async getReviewsFromUserProducts(request: Request) {
    if (!request.params) {
      throw new BadRequestException("Dados inválidos.");
    }
    const { id } = request.params;
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      throw new NotFoundException("Usuário não encontrado.");
    }
    return await this.reviewRepository.getEveryReviewFromUserProducts(
      user.id as string
    );
  }

  async submitReview(request: Request) {
    if (!request.user || !request.body) {
      throw new BadRequestException("Dados inválidos.");
    }

    try {
      ReviewValidator.checkCreate(request.body);
    } catch (e: any) {
      throw new BadRequestException(e.message);
    }
    const { product, text, score, productOwner } = request.body;

    const reviewer = await this.userRepository.getUserById(request.user.id);
    if (!reviewer) {
      throw new NotFoundException("Usuário não encontrado.");
    }

    await this.reviewRepository.createReview(
      reviewer.id as string,
      {
        product,
        text,
        score,
        productOwner,
      } as Review
    );
  }

  async deleteReview(request: Request) {
    if (!request.params) {
      throw new BadRequestException("Dados inválidos");
    }

    const { id } = request.params;
    const review = await this.reviewRepository.getReviewById(id);
    if (!review) {
      throw new NotFoundException("Análise não encontrada.");
    }

    const user = await this.userRepository.getUserById(request.user.id);
    if (!user) {
      throw new NotFoundException("Usuário não encontrado.");
    }

    if (user.id !== review.author.toString()) {
      throw new NotAuthorizedException("Não autorizado.");
    }

    await this.reviewRepository.deleteReview(review.id as string);
  }
  async updateReview(request: Request) {
    if (!request.params || !request.user || !request.body) {
      throw new BadRequestException("Dados inválidos.");
    }

    try {
      ReviewValidator.checkUpdate(request.body);
    } catch (e: any) {
      throw new BadRequestException(e.message);
    }

    const { text, score } = request.body;
    const { id } = request.params;
    const review = await this.reviewRepository.getReviewById(id);
    if (!review) {
      throw new NotFoundException("Análise não encontrada.");
    }

    const user = await this.userRepository.getUserById(request.user.id);
    if (!user) {
      throw new NotFoundException("Usuário não encontrado.");
    }

    if (user.id !== review.author.toString()) {
      throw new NotAuthorizedException("Não autorizado.");
    }

    await this.reviewRepository.updateReview(review.id, { text, score });
  }
}
