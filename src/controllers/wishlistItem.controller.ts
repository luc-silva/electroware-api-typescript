import { Controller, Delete, Get, Post, Req } from "@nestjs/common";
import { Request, Response } from "express";
import { WishlistItemService } from "../services/WishlistItem.service";

@Controller("api/wishlist")
export class WishlistItemController {
  constructor(private wishlistItemService: WishlistItemService) {}

  /**
   * GET, AUTH REQUIRED - Get wishlist items of a user with given valid ObjectId.
   * @param {Request} request - The HTTP request object containing the ID of a user.
   * @throws throws error if receives a invalid ID or if a use has not been found.
   */
  @Get("/")
  async getWishlistItems(@Req() request: Request) {
    return await this.wishlistItemService.getWishListItems(request);
  }

  /**
   * POST, AUTH REQUIRED - Create a wishilist instance with given valid product ObjectID.
   * @param {Request} request - The HTTP request object containing product info and user.
   * @throws throws error if receives a invalid id, invalid body data, or if a user or collection has not been found.
   */
  @Post("/")
  async createWishlistItem(@Req() request: Request) {
    await this.wishlistItemService.createWishlistItem(request);
    return { message: "Adicionado à lista." };
  }

  /**
   * DELETE, AUTH REQUIRED - Delete a wishlist instance with given valid ObjectID.
   * @param {Request} request - The HTTP request object containing the id of the instance as a parameter.
   * @throws throws error if receives a invalid id, invalid body data, or if a use has not been found.
   */
  @Delete("/:id")
  async removeWishlistItem(@Req() request: Request) {
    await this.removeWishlistItem(request);
    return { message: "Feito." };
  }
}
