import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ImageRepository } from "../repositories/ImageRepository";
import { UserRepository } from "../repositories/UserRepository";
import { Request } from "express";
import { NotAuthorizedException } from "../exceptions/NotAuthorizedException";

@Injectable()
export class ImageInstanceService {
  constructor(
    private imageRepository: ImageRepository,
    private userRepository: UserRepository
  ) {}

  async getUserImage(request: Request) {
    if (!request.params.id) {
      throw new BadRequestException("URL inválida.");
    }

    const { id } = request.params;
    const userImage = await this.imageRepository.getUserImage(id);
    if (!userImage) {
      throw new NotFoundException("Imagem não encontrada.");
    }

    return userImage;
  }

  async getProductImage(request: Request) {
    if (!request.params.id) {
      throw new BadRequestException("URL inválida.");
    }

    const { id } = request.params;
    const userImage = await this.imageRepository.getProductImage(id);
    if (!userImage) {
      throw new NotFoundException("Imagem não encontrada.");
    }

    return userImage;
  }

  async createImage(request: Request) {
    if (!request.file || !request.user.id) {
      throw new BadRequestException("Dados inválidos.");
    }
    const { buffer } = request.file;

    await this.imageRepository.createImage(request.user.id, {
      user: request.user.id,
      data: buffer,
      imageType: "userImage",
    });
  }

  async updateImage(request: Request) {
    if (!request.file || !request.body) {
      throw new BadRequestException("Imagem inválida.");
    }

    const { buffer } = request.file;
    const { imageType } = request.body;
    if (imageType !== "userImage" && imageType !== "productImage") {
      throw new BadRequestException("Dados inválidos.");
    }

    if (!request.user) {
      throw new NotAuthorizedException("Não autorizado.");
    }

    const user = await this.userRepository.getUserById(request.user.id);
    if (!user) {
      throw new NotFoundException("Usuário não encontrado.");
    }

    const imageAlreadyExist = await this.imageRepository.getUserImage(
      user.id as string
    );
    if (imageAlreadyExist) {
      if (imageAlreadyExist.user !== user.id) {
        throw new Error("Não autorizado");
      }

      await this.imageRepository.updateImage(imageAlreadyExist.id as string, {
        user: user.id as string,
        data: buffer,
        imageType,
      });
    } else {
      await this.imageRepository.createImage(user.id as string, {
        user: user.id as string,
        data: buffer,
        imageType,
      });
    }
  }
}
