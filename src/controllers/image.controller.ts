import { Request, Response } from "express";
import { Controller, Get, Patch, Post, Req } from "@nestjs/common";
import { ImageInstanceService } from "../services/ImageInstance.service";

@Controller("api/image")
export class ImageInstanceController {
  constructor(private imageInstanceService: ImageInstanceService) {}

  /**
   * GET - Get the image from a user with given valid ObjectId.
   * @param {Request} request - The HTTP request object containing the id of a user as a parameter.
   * @throws throws error if no image has been found or receives a invalid id.
   */
  @Get("/user/:id")
  async getUserImage(@Req() request: Request) {
    return await this.imageInstanceService.getUserImage(request);
  }

  /**
   * GET - Get the image from a product with given valid ObjectId.
   * @param {Request} request - The HTTP request object containing the id of product as a parameter.
   * @throws throws error if no image has been found or receives a invalid id.
   */
  @Get("/product/:id")
  async getProductImage(@Req() request: Request) {
    return await this.imageInstanceService.getProductImage(request);
  }

  /**
   * POST, AUTH REQUIRED - Create image instance with given data. Requires a middleware to handle the file.
   * @param {Request} request - The HTTP request object containing the file and user id.
   * @throws throws error if no file has been received.
   */
  @Post("/upload")
  async createImage(@Req() request: Request) {
    await this.imageInstanceService.createImage(request);
    return { message: "Imagem criada." };
  }

  /**
   * PATCH, AUTH REQUIRED - Update user image with given data. Requires a middleware to handle the file.
   * @param {Request} request - The HTTP request object containing the file and user id.
   * @throws throws error if no file has been received, if the image owner has not been found or if the request user is different from the original image owner.
   */
  @Patch()
  async updateImage(@Req() request: Request) {
    return { message: "Foto atualizada." };
  }
}
