import { Controller, Delete, Get, Post, Put, Req } from "@nestjs/common";
import { Request } from "express";
import { WishlistCollectionService } from "../services/WishlistCollection.service";

@Controller("api/collection")
export class WishlistCollectionController {
  constructor(private wishlistCollectionService: WishlistCollectionService) {}

  /**
   * GET - Get itens from a collection with given id.
   * @param  {Request} request The HTTP request object containing the data.
   * @throws throws error if the data is not valid.
   */
  @Get("/:id/products")
  async getWishlistItensFromCollection(@Req() request: Request) {
    return await this.wishlistCollectionService.getWishlistItensFromCollection(
      request
    );
  }

  /**
   * POST, AUTH REQUIRED - Create a collection with given data.
   * @param  {Request} request The HTTP request object containing the data.
   * @throws throws error if the data is not valid or if a collection with given name already exist.
   */
  @Post("/")
  async createCollection(@Req() request: Request) {
    await this.wishlistCollectionService.createCollection(request);
    return { message: "feito" };
  }

  /**
   * PUT, AUTH REQUIRED - Update a collection with given data and collection id.
   * @param  {Request} request The HTTP request object containing the data and id.
   * @throws throws error if the data is not valid, if a collection has not been found or if the collection owner is different from request user.
   */
  @Put("/:id")
  async updateCollection(@Req() request: Request) {
    await this.wishlistCollectionService.updateCollection(request);
    return { message: "feito" };
  }

  /**
   * DELETE, AUTH REQUIRED - Delete a collection with given collection id.
   * @param  {Request} request - The HTTP request object containing the id.
   * @throws throws error if the data is not valid.
   */
  @Delete("/:id")
  async deleteCollection(@Req() request: Request) {
    await this.wishlistCollectionService.deleteCollection(request);
    return { message: "feito" };
  }
}
