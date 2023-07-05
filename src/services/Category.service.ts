import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CategoryRepository } from "../repositories/CategoryRepository";
import { Request } from "express";
import { ProductRepository } from "../repositories/ProductRepository";
import CategoryValidator from "../validators/CategoryValidator";

@Injectable()
export class CategoryService {
  constructor(
    private categoryRepository: CategoryRepository,
    private productRepository: ProductRepository
  ) {}

  async create(request: Request) {
    if (!request.body) {
      throw new BadRequestException("Insira dados válidos");
    }

    const { name } = request.body;
    if (typeof name !== "string") {
      throw new BadRequestException("Insira dados válidos");
    }

    const categoryExists = await this.categoryRepository.getCategoryByName(
      name
    );
    if (categoryExists) {
      throw new BadRequestException("Categoria já existente.");
    }

    await this.categoryRepository.createCategory(request.body);
  }

  async listCategories(request: Request) {
    return await this.categoryRepository.getCategoryNames();
  }

  async getCategory(request: Request) {
    if (!request.params) {
      throw new BadRequestException("URL Inválida.");
    }

    const { id } = request.params;
    try {
      CategoryValidator.checkId(id);
    } catch (e: any) {
      throw new BadRequestException(e.message);
    }

    const category = await this.categoryRepository.getCategory(id);
    if (!category) {
      throw new NotFoundException("Categoria não encontrada.");
    }

    return category;
  }
}
