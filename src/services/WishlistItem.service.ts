import { Request } from "express";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { UserRepository } from "../repositories/UserRepository";
import { WishlistItemRepository } from "../repositories/WishlistItemRepository";
import { ProductRepository } from "../repositories/ProductRepository";
import { WishlistCollectionRepository } from "../repositories/WishlistCollectionRepository";
import { NotAuthorizedException } from "../exceptions/NotAuthorizedException";

@Injectable()
export class WishlistItemService {
  constructor(
    private wishlistItemRepository: WishlistItemRepository,
    private userRepository: UserRepository,
    private productRepository: ProductRepository,
    private wishlistCollectionRepository: WishlistCollectionRepository
  ) {}

  async getWishListItems(request: Request) {
    if (!request.user) {
      throw new BadRequestException("Dados inválidos");
    }

    const user = await this.userRepository.getUserById(request.user.id);
    if (!user) {
      throw new NotFoundException("Usuário não encontrado");
    }

    return await this.wishlistItemRepository.getWishlistItemsByUser(
      request.user.id
    );
  }

  async createWishlistItem(request: Request) {
    if (!request.user || !request.body) {
      throw new BadRequestException("Dados inválidos.");
    }
    const { product, group } = request.body;

    const user = await this.userRepository.getUserById(request.user.id);
    if (!user) {
      throw new NotFoundException("Usuário não encontrado.");
    }

    const productFound = await this.productRepository.getProductDetails(
      product
    );
    if (!productFound) {
      throw new NotFoundException("Produto não encontrado.");
    }

    if (productFound.owner === user.id) {
      throw new BadRequestException(
        "Não é possivel adicionar o próprio produto."
      );
    }

    const collection =
      await this.wishlistCollectionRepository.getCollectionById(group);
    if (!collection) {
      throw new NotFoundException("Coleção não encontrada.");
    }

    const alreadyAddedToCollection =
      await this.wishlistItemRepository.getWishlistItemByUserProductAndCollection(
        user.id as string,
        product,
        collection.id
      );
    if (alreadyAddedToCollection) {
      throw new BadRequestException(
        "Produto já adicionado à coleção selecionada."
      );
    }

    await this.wishlistItemRepository.createWishlistItem(user.id as string, {
      id: productFound.id,
      product: productFound.id,
      group: collection.id,
    });
  }

  async removeWishlistItem(request: Request) {
    if (!request.user || !request.params) {
      throw new BadRequestException("Dados inválidos");
    }
    const { id } = request.params;

    const wishlistItem = await this.wishlistItemRepository.getWishlistItem(id);
    if (!wishlistItem) {
      throw new NotFoundException("Produto não encontrado");
    }

    const user = await this.userRepository.getUserById(request.user.id);
    if (!user) {
      throw new NotFoundException("Usuário não encontrado");
    }

    if (user.id !== wishlistItem.user.toString()) {
      throw new NotAuthorizedException("Não autorizado.");
    }

    await this.wishlistItemRepository.deleteWishlistItem(id);
  }
}
