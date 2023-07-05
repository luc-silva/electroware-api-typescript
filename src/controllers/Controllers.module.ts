import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";

//controllers
import { CartItemController } from "./cartItem.controller";
import { CategoryController } from "./category.controller";
import { ImageInstanceController } from "./image.controller";
import { ProductController } from "./product.controller";
import { ReviewController } from "./review.controller";
import { TransactionController } from "./transaction.controller";
import { UserController } from "./user.controller";
import { WishlistCollectionController } from "./wishlistCollection.controller";
import { WishlistItemController } from "./wishlistItem.controller";
import { ServiceModule } from "../services/Services.module";
import { AuthMiddleware } from "../middleware/auth";
import { ImageUploader } from "../middleware/buffer";

@Module({
  imports: [ServiceModule],
  controllers: [
    CartItemController,
    CategoryController,
    ImageInstanceController,
    ProductController,
    ReviewController,
    TransactionController,
    UserController,
    WishlistCollectionController,
    WishlistItemController,
  ],
})
export class ControllerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware) //todo: list routes that requires auth
      .forRoutes(
        {
          path: "api/user/private/details/password",
          method: RequestMethod.PATCH,
        },
        { path: "api/user/private/details/email", method: RequestMethod.PATCH },
        { path: "api/user/private/:id", method: RequestMethod.GET },
        { path: "api/user/billings/add", method: RequestMethod.PATCH },
        { path: "api/user/:id", method: RequestMethod.DELETE },
        { path: "api/user/:id", method: RequestMethod.PUT },
        { path: "api/user/:id/transactions", method: RequestMethod.GET },
        { path: "api/user/:id/private/collections", method: RequestMethod.GET },
        //cart item
        { path: "api/shoppingcart/", method: RequestMethod.POST },
        { path: "api/shoppingcart/", method: RequestMethod.GET },
        { path: "api/shoppingcart/:id", method: RequestMethod.DELETE },
        { path: "api/shoppingcart/:id", method: RequestMethod.GET },
        //image
        { path: "api/image/upload", method: RequestMethod.POST },
        //product
        { path: "api/product/create", method: RequestMethod.POST },
        { path: "api/product/:id", method: RequestMethod.PUT },
        { path: "api/product/:id", method: RequestMethod.DELETE },
        { path: "api/product/:id", method: RequestMethod.PUT },
        //review
        { path: "api/review", method: RequestMethod.POST },
        { path: "api/review/:id", method: RequestMethod.DELETE },
        { path: "api/review/:id", method: RequestMethod.PATCH },
        //transaction item
        { path: "api/transaction/", method: RequestMethod.POST },
        //collection
        { path: "api/collection/", method: RequestMethod.POST },
        { path: "api/collection/:id", method: RequestMethod.PUT },
        { path: "api/collection/:id", method: RequestMethod.DELETE },
        //wishlist item
        { path: "api/wishlist/", method: RequestMethod.GET },
        { path: "api/wishlist/", method: RequestMethod.POST },
        { path: "api/wishlist/:id", method: RequestMethod.DELETE }
      );
    //
    consumer
      .apply(ImageUploader) //todo:list routes that holds image
      .forRoutes({ path: "api/image/upload", method: RequestMethod.POST });
  }
}
