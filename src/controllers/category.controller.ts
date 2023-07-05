import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { CategoryService } from "../services/Category.service";
import { ProductService } from "../services/Product.service";

@Controller("api/category")
export class CategoryController {
  constructor(
    private categoryService: CategoryService,
    private productService: ProductService
  ) {}

  /**
   * POST - Create a category for products with given name.
   * @param {Request} request - The HTTP request object containing category name.
   * @param {Response} response - The HTTP response object containing a conclusion message.
   * @throws throws error if receives an invalid name or if a category has already been created.
   */
  @Post("/")
  async createCategory(@Req() request: Request) {
    await this.categoryService.create(request);
    return { message: "Categoria Criada." };
  }

  /**
   * GET - Get products from a specific category with given valid ObjectId.
   * @param {Request} request - The HTTP request containing category id.
   * @throws throws error if receives invalid data or if a category has not been found.
   */
  @Get("/:id/products")
  async getProductsFromCategory(@Req() request: Request) {
    return await this.productService.getProductFromCategory(request);
  }

  /**
   * Get - Get every products categories names.
   * @param {Request} request - HTTP request doesn't requires any params or data.
   * @throws throws error only with unexpected issues.
   */
  @Get("/")
  async getCategories(@Req() request: Request) {
    return await this.categoryService.listCategories(request);
  }

  /**
   * GET - Get details of a category with given valid ObjectId
   * @param {Request} request - The HTTP request object containing category id.
   * @param {Response} response - The HTTP response object containing category info.
   * @throws throws error if receives a invalid data and if a category has not been found.
   */
  @Get("/:id")
  async getCategory(@Req() request: Request) {
    return await this.categoryService.getCategory(request);
  }
}
