import ProductInstanceValidator from "../validators/ProductInstanceValidator";
import { NotAuthorizedException } from "../exceptions/NotAuthorizedException";
import { calculateDiscountedValue } from "../utils/operations";
import { Request } from "express";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { UserRepository } from "../repositories/UserRepository";
import { ProductRepository } from "../repositories/ProductRepository";
import { ImageRepository } from "../repositories/ImageRepository";
import { CartItemRepository } from "../repositories/CartItemRepository";

@Injectable()
export class CartItemService {
  constructor(
    private userRepository: UserRepository,
    private productRepository: ProductRepository,
    private imageRepository: ImageRepository,
    private cartItemRepository: CartItemRepository
  ) {}

  async createInstance(request: Request) {
    if (!request.user || !request.body) {
      throw new BadRequestException("Dados inválidos.");
    }

    const cartItemData = request.body;
    try {
      ProductInstanceValidator.checkCreate(cartItemData);
    } catch (e: any) {
      throw new BadRequestException(e.message);
    }

    const { product } = cartItemData;
    const instanceOwner = await this.userRepository.getUserById(
      request.user.id
    );
    if (!instanceOwner) {
      throw new NotFoundException("Usuario não encontrado.");
    }

    const instanceProduct = await this.productRepository.getProductDetails(
      product
    );
    if (!instanceProduct) {
      throw new BadRequestException("Produto indisponível.");
    }

    if (instanceProduct.quantity === 0) {
      throw new BadRequestException("Produto indisponível.");
    }
    if (instanceProduct.owner === instanceOwner.id) {
      throw new BadRequestException(
        "Você não pode comprar o seu próprio produto."
      );
    }

    const productImage = await this.imageRepository.getProductImage(
      instanceProduct.id
    );
    if (!productImage) {
      throw new BadRequestException("O Produto não possui imagem.");
    }

    const instanceAlreadyExist =
      await this.cartItemRepository.getCartItemByIdAndUser(
        instanceProduct.id,
        instanceOwner.id as string
      );
    if (instanceAlreadyExist) {
      throw new BadRequestException(
        "Item já adicionado ao carrinho de compras."
      );
    }

    const price = instanceProduct?.on_sale
      ? calculateDiscountedValue(
          instanceProduct.price,
          instanceProduct.discount
        )
      : instanceProduct?.price;

    await this.cartItemRepository.createCartItem({
      ...cartItemData,
      seller: instanceProduct.owner,
      productImage: productImage.id,
      price,
    });
  }

  async deleteCartItem(request: Request) {
    if (!request.params || !request.user) {
      throw new BadRequestException("Dados inválidos");
    }

    const { id } = request.params;
    const cartItem = await this.cartItemRepository.getCartItem(id);
    if (!cartItem) {
      throw new NotFoundException("Item não encontrado.");
    }

    const user = await this.userRepository.getUserById(request.user.id);
    if (!user) {
      throw new NotFoundException("Usuário não encontrado.");
    }

    if (cartItem.user.toString() !== user.id) {
      throw new NotAuthorizedException("Não autorizado.");
    }

    await this.cartItemRepository.deleteCartItem(cartItem.id);
  }

  async getInstances(request: Request) {
    if (!request.user) {
      throw new BadRequestException("Dados inválidos");
    }

    const user = await this.userRepository.getUserById(request.user.id);
    if (!user) {
      throw new NotFoundException("Usuario não encontrado.");
    }
    return await this.cartItemRepository.getCartItemsByUser(user.id as string);
  }

  async getCartItem(request: Request) {
    if (!request.params || !request.user) {
      throw new BadRequestException("Dados inválidos.");
    }

    const user = await this.userRepository.getUserById(request.user.id);
    if (!user) {
      throw new NotFoundException("Usuário não encontrado.");
    }

    const { id } = request.params;
    const cartItem = await this.cartItemRepository.getCartItemAndPopulate(id);
    if (!cartItem) {
      throw new NotFoundException("Item não encontrado.");
    }

    return cartItem;
  }
}
