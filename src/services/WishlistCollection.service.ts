import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { UserRepository } from "../repositories/UserRepository";
import { WishlistItemRepository } from "../repositories/WishlistItemRepository";
import { WishlistCollectionRepository } from "../repositories/WishlistCollectionRepository";
import { Request } from "express";
import { startSession } from "mongoose";
import WishlistCollectionValidator from "../validators/WishlistCollectionValidator";
import { NotAuthorizedException } from "../exceptions/NotAuthorizedException";

@Injectable()
export class WishlistCollectionService {
  constructor(
    private userRepository: UserRepository,
    private wishlistItemRepository: WishlistItemRepository,
    private wishlistCollectionRepository: WishlistCollectionRepository
  ) {}

  async getWishlistItensFromCollection(request: Request) {
    if (!request.params) {
      throw new BadRequestException("Dados inválidos.");
    }

    const { id } = request.params;

    return await this.wishlistItemRepository.getWishlistItemsByCollection(id);
  }

  async createCollection(request: Request) {
    if (!request.user || !request.body) {
      throw new BadRequestException("Dados inválidos.");
    }

    const collectionData: CollectionDTO = request.body;

    try {
      WishlistCollectionValidator.checkCreate(collectionData);
    } catch (e: any) {
      throw new BadRequestException(e.message);
    }

    const user = await this.userRepository.getUserById(request.user.id);
    if (!user) {
      throw new NotFoundException("Usuário não encontrado.");
    }

    const collectionAlreadyExists =
      await this.wishlistCollectionRepository.getCollectionByNameFromUser(
        user.id as string,
        collectionData.name
      );

    if (collectionAlreadyExists) {
      throw new BadRequestException("Já existe uma coleção com esse nome.");
    }

    await this.wishlistCollectionRepository.createCollection({
      ...collectionData,
      user: user.id as string,
    });
  }

  async updateCollection(request: Request) {
    if (!request.user || !request.body || !request.params) {
      throw new BadRequestException("Dados inválidos.");
    }
    const { id } = request.params;

    const collectionToBeUpdated =
      await this.wishlistCollectionRepository.getCollectionById(id);
    if (!collectionToBeUpdated) {
      throw new NotFoundException("Coleção não encontrada.");
    }

    const collectionData: CollectionDTO = request.body;
    try {
      WishlistCollectionValidator.checkCreate(collectionData);
    } catch (e: any) {
      throw new BadRequestException(e.message);
    }

    if (
      collectionData.user !== request.user.id ||
      collectionData.user !== collectionToBeUpdated.user.toString()
    ) {
      throw new NotAuthorizedException("Não autorizado.");
    }

    await this.wishlistCollectionRepository.updateCollectionDetails(
      id,
      collectionData
    );
  }

  async deleteCollection(request: Request) {
    if (!request.user || !request.params) {
      throw new Error("Dados inválidos.");
    }

    const { id } = request.params;
    const collection =
      await this.wishlistCollectionRepository.getCollectionById(id);

    const session = await startSession();
    await session.withTransaction(async () => {
      if (!collection) {
        throw new NotFoundException("Coleção não encontrada.");
      }

      if (collection.user.toString() !== request.user.id) {
        throw new NotAuthorizedException("Não Autorizado.");
      }

      await this.wishlistItemRepository.deleteWishlistItemsByCollection(id, {
        session,
      });
      await this.wishlistCollectionRepository.deleteCollection(id, { session });
      session.commitTransaction();
    });
    await session.endSession();
  }
}
