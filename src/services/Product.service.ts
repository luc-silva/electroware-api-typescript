import ProductValidator from "../validators/ProductValidator";
import { NotAuthorizedException } from "../exceptions/NotAuthorizedException";
import { Request } from "express";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { ProductRepository } from "../repositories/ProductRepository";
import { ImageRepository } from "../repositories/ImageRepository";
import { CategoryRepository } from "../repositories/CategoryRepository";
import { UserRepository } from "../repositories/UserRepository";

@Injectable()
export class ProductService {
  constructor(
    private productRepository: ProductRepository,
    private imageRepository: ImageRepository,
    private categoryRepository: CategoryRepository,
    private userRepository: UserRepository
  ) {}

  async getRecentProducts(request: Request) {
    return await this.productRepository.getRecentProducts();
  }

  async getDiscountedProducts(request: Request) {
    return await this.productRepository.getDiscountedProducts();
  }

  async getProductRating(request: Request) {
    if (!request.params) {
      throw new BadRequestException("Produto inválido");
    }
    const { id } = request.params;

    const average = await this.productRepository.getAverageScoreFromProduct(id);
    const scoreMetrics = await this.productRepository.getRatingsMetrics(id);

    return { average, scoreMetrics };
  }

  async searchProduct(request: Request) {
    if (!request.params) {
      throw new BadRequestException("Critérios de busca inválidos.");
    }

    const { keyword } = request.params;
    if (typeof keyword !== "string") {
      throw new BadRequestException("Critérios de busca inválidos.");
    }

    return await this.productRepository.getProductsIdsWithKeyword(keyword);
  }

  async getProductDetails(request: Request) {
    if (!request.params) {
      throw new BadRequestException("URL Inválida.");
    }

    const { id } = request.params;

    const product = await this.productRepository.getProductDetails(id);
    if (!product) {
      throw new NotFoundException("Produto não encontrado.");
    }

    const image = await this.imageRepository.getProductImage(product.id);
    if (!image) {
      throw new NotFoundException("Imagem do produto não encontrada.");
    }

    return { product, image: image }; //testar image se tem .data
  }

  async getProductFromCategory(request: Request) {
    if (!request.params) {
      throw new BadRequestException("Dados inválidos.");
    }
    const { id } = request.params;
    const category = await this.categoryRepository.getCategory(id);
    if (!category) {
      throw new NotFoundException("Categoria não encontrada");
    }

    return await this.categoryRepository.getCategoryProducts(category.id);
  }

  async createProduct(request: Request) {
    if (!request.body || !request.user || !request.file) {
      throw new BadRequestException("Dados inválidos.");
    }

    const user = await this.userRepository.getUserById(request.user.id);
    if (!user) {
      throw new NotFoundException("Usuário não encontrado");
    }

    const requestBody = JSON.parse(request.body.product);

    try {
      ProductValidator.checkCreate(requestBody);
    } catch (e: any) {
      throw new BadRequestException(e.message);
    }

    const { price, quantity } = requestBody;

    const convertedQuantity = Number(quantity);
    const convertedPrice = Number(price);

    const { buffer } = request.file;

    const productData = {
      ...requestBody,
      price: convertedPrice,
      quantity: convertedQuantity,
    };
    const imageData = {
      user: request.user.id,
      data: buffer,
      imageType: "productImage" as "productImage" | "userImage",
    };

    const productID = await this.productRepository.createProduct(
      productData,
      imageData
    );

    return { message: "Anúncio Criado.", productID };
  }

  async updateProduct(request: Request) {
    if (!request.params || !request.body || !request.user) {
      throw new BadRequestException("Dados inválidos");
    }

    const user = await this.userRepository.getUserById(request.user.id);
    if (!user) {
      throw new NotFoundException("Usuário não encontrado");
    }

    const productDataBody = request.body;
    try {
      ProductValidator.checkCreate(productDataBody);
    } catch (e: any) {
      throw new BadRequestException(e.message);
    }

    const { price, quantity } = productDataBody;

    const updatedProductData = {
      ...productDataBody,
      price: Number(price),
      quantity: Number(quantity),
    };

    const { id } = request.params;
    await this.productRepository.updateProduct(id, updatedProductData);
  }

  async deleteProduct(request: Request) {
    if (!request.user || !request.params) {
      throw new BadRequestException("Dados inválidos");
    }

    const user = await this.userRepository.getUserById(request.user.id);
    if (!user) {
      throw new NotFoundException("Usuário não encontrado.");
    }

    const { id } = request.params;

    const product = await this.productRepository.getProductDetails(id);
    if (!product) {
      throw new NotFoundException("Produto não encontrado.");
    }
    if (product.owner.toString() !== user.id) {
      throw new NotAuthorizedException("Não autorizado.");
    }

    await this.productRepository.deleteProduct(id);
  }
}
