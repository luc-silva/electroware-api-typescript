import asyncHandler from "express-async-handler";

import { Request, Response } from "express";
import ReviewValidator from "../validators/ReviewValidator";
import { Types } from "mongoose";
import ReviewRepository from "../repositories/ReviewRepository";
import ProductRepository from "../repositories/ProductRepository";
import UserRepository from "../repositories/UserRepository";
import { IReview } from "../../interface";

/**
 * GET - Get a review with given valid ObjectId.
 *
 * @param {Request} request - The HTTP request object containing the review ID.
 * @param {Response} response - The HTTP response object containing the review info.
 * @throws throws error if review id isn't valid or if the review has not been found.
 */
export const getSingleReview = asyncHandler(
  async (request: Request, response: Response) => {
    if (!request.params) {
      response.status(400);
      throw new Error("Dados Inválidos.");
    }

    const { id } = request.params;
    const review = await ReviewRepository.getReviewAndPopulate(id);
    if (!review) {
      response.status(404);
      throw new Error("Avaliação não encontrada.");
    }

    response.status(200).json(review);
  }
);

/**
 * GET - Get product reviews with given valid ObjectId.
 *
 * @param {Request} request - The HTTP request object containing the product ID.
 * @param {Response} response - The HTTP response object containing the review IDs or a message.
 * @throws throws error if product id isn't valid or if the product has not been found.
 */
export const getProductReviews = asyncHandler(
  async (request: Request, response: Response) => {
    if (!request.params) {
      response.status(400);
      throw new Error("Dados Inválidos.");
    }

    const { id } = request.params;
    const product = await ProductRepository.getProductDetails(id);
    if (!product) {
      response.status(404);
      throw new Error("Produto não encontrado.");
    }

    const reviews = await ReviewRepository.getProductReviews(product.id);
    if (!reviews) {
      response
        .status(404)
        .json({ message: "Esse produto ainda não possui avaliações." });
    }

    response.status(200).json(reviews);
  }
);

/**
 * GET - Get every user reviews made with given valid user ObjectId.
 *
 * @param {Request} request - The HTTP request object containing the user ID.
 * @param {Response} response - The HTTP response object containing the review IDs or a message.
 * @throws throws error if user id isn't valid or if the user has not been found.
 */
export const getEveryUserReviews = asyncHandler(
  async (request: Request, response: Response) => {
    if (!request.params) {
      response.status(400);
      throw new Error("Dados Inválidos.");
    }

    const { id } = request.params;

    const user = await UserRepository.getUser(id);
    if (!user) {
      response.status(404);
      throw new Error("Usuário não encontrado.");
    }

    const reviews = await ReviewRepository.getReviewsMadeByUser(user.id);
    if (reviews.length === 0) {
      response.status(200).json({ message: "Sem análises disponíveis." });
    }

    response.status(200).json(reviews);
  }
);

/**
 * GET - Get reviews from a product where the user is the owner with given valid user ObjectId.
 *
 * @param {Request} request - The HTTP request object containing the user ID.
 * @param {Response} response - The HTTP response object containing the review ids or a message.
 * @throws throws error if user id isn't valid or if the user has not been found.
 */
export const getReviewsFromUserProducts = asyncHandler(
  async (request: Request, response: Response) => {
    if (!request.params) {
      response.status(400);
      throw new Error("Dados Inválidos.");
    }

    const { id } = request.params;
    if (!Types.ObjectId.isValid(id)) {
      response.status(400);
      throw new Error("Dados Inválidos");
    }

    const user = await UserRepository.getUser(id);
    if (!user) {
      response.status(404);
      throw new Error("Usuário não encontrado.");
    }
    const reviews = await ReviewRepository.getEveryReviewFromUserProducts(
      user.id
    );

    if (reviews.length === 0) {
      response.status(404).json({ message: "Sem análises disponíveis." });
    }

    response.status(200).json(reviews);
  }
);

/**
 * POST, AUTH REQUIRED - Create a review instance with given data.
 *
 * @param {Request} request - The HTTP request object containing the user ID, text, score, productOwner ID and product ID.
 * @param {Response} response - The HTTP response object containing a conclusion message.
 * @throws throws error if body isn't valid or if review author has not been found.
 */
export const submitReview = asyncHandler(
  async (request: Request, response: Response) => {
    if (!request.user || !request.body) {
      response.status(400);
      throw new Error("Dados Inválidos.");
    }

    ReviewValidator.validate(response, request.body);
    const { product, text, score, productOwner } = request.body;

    const reviewer = await UserRepository.getUser(request.user.id);
    if (!reviewer) {
      response.status(404);
      throw new Error("Usuário não encontrado.");
    }

    await ReviewRepository.createReview(reviewer.id, {
      product,
      text,
      score,
      productOwner,
    } as IReview);
    response.status(201).json({ message: "Análise Publicada." });
  }
);

/**
 * DELETE, AUTH REQUIRED - Delete a review instance with given valid ObjectId id.
 *
 * @param {Request} request - The HTTP request object containing the user and review ID.
 * @param {Response} response - The HTTP response object containing s conclusion message.
 * @throws throws error if review author, review author is different from request user or if the review has not been found.
 */
export const deleteReview = asyncHandler(
  async (request: Request, response: Response) => {
    if (!request.params) {
      response.status(400);
      throw new Error("Dados Inválidos");
    }

    const { id } = request.params;
    const review = await ReviewRepository.getReview(id);
    if (!review) {
      response.status(404);
      throw new Error("Análise não encontrada.");
    }

    const user = await UserRepository.getUser(request.user.id);
    if (!user) {
      response.status(404);
      throw new Error("Usuário não encontrado.");
    }

    if (user.id !== review.author.toString()) {
      response.status(401);
      throw new Error("Não autorizado.");
    }

    await ReviewRepository.deleteReview(review.id);
    response.status(200).json({ message: "Análise Excluida." });
  }
);

/**
 * PATCH, AUTH REQUIRED - Update a review instance with given valid ObjectId id and data.
 *
 * @param {Request} request - The HTTP request object containing the user and review ID, score and text.
 * @param {Response} response - The HTTP response object containing s conclusion message.
 * @throws throws error if review author, review author is different from request user or if the review has not been found.
 */
export const updateReview = asyncHandler(
  async (request: Request, response: Response) => {
    if (!request.params || !request.user || !request.body) {
      response.status(400);
      throw new Error("Dados Inválidos.");
    }

    ReviewValidator.validateUpdate(response, request.body);
    const { text, score } = request.body;

    const { id } = request.params;
    const review = await ReviewRepository.getReview(id);
    if (!review) {
      response.status(404);
      throw new Error("Análise não encontrada.");
    }

    const user = await UserRepository.getUser(request.user.id);
    if (!user) {
      response.status(404);
      throw new Error("Usuário não encontrado.");
    }

    if (user.id !== review.author.toString()) {
      response.status(401);
      throw new Error("Não autorizado.");
    }

    await ReviewRepository.updateReview(review.id, { text, score });
    response.status(200).json({ message: "Análise Atualizada." });
  }
);
