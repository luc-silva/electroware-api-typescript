import { Controller, Delete, Get, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { CartItemService } from "../services/CartItem.service";

@Controller("api/shoppingcart")
export class CartItemController {
  constructor(private cartItemService: CartItemService) {}

  /**
   * POST, AUTH REQUIRED - Create a shoppingcart instance for checkout.
   * @param {Request} request - The HTTP request object containing user, product, price and quantity.
   * @throws throws error if receives a invalid data, if user tries to buy its own product, if a product is not available and if user has not been found.
   */
  @Post("/")
  async createInstance(@Req() request: Request) {
    await this.cartItemService.createInstance(request);
    return { message: "Adicionado ao Carrinhos de Compras." };
  }

  /**
   * DELETE, AUTH REQUIRED - delete a shoppingcart instance with a given valid ObjectId.
   * @param {Request} request - The HTTP request object containing user and instance id.
   * @throws throws error if receives a invalid id, if the instance owner id is different from request user id, and if user or instance has not been found.
   */
  @Delete("/:id")
  async deleteCartItem(@Req() request: Request) {
    await this.cartItemService.deleteCartItem(request);
    return { message: "Produto(s) Removido(s)." };
  }

  /**
   * GET, AUTH REQUIRED - Get shoppingcart instances from a user with a given valid user ObjectId.
   * @param {Request} request - The HTTP request object containing user.
   * @throws throws error if receives a invalid data and if user has not been found.
   */
  @Get("/")
  async getInstances(@Req() request: Request) {
    return await this.cartItemService.getInstances(request);
  }

  /**
   * GET, AUTH REQUIRED - Get a single shopping instance with a given valid instance ObjectId
   * @param {Request} request - The HTTP request object containing user and instance id.
   * @throws throws error if receives a invalid data and if user has not been found.
   */
  @Get("/:id")
  async getCartItem(@Req() request: Request) {
    return this.cartItemService.getCartItem(request);
  }
}
