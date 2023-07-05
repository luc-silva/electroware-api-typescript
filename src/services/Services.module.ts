import { Module } from "@nestjs/common";

//repositories
import { UserRepository } from "../repositories/UserRepository";
import { ProductRepository } from "../repositories/ProductRepository";
import { WishlistItemRepository } from "../repositories/WishlistItemRepository";
import { CartItemRepository } from "../repositories/CartItemRepository";
import { CategoryRepository } from "../repositories/CategoryRepository";
import { ImageRepository } from "../repositories/ImageRepository";
import { ReviewRepository } from "../repositories/ReviewRepository";
import { TransactionRepository } from "../repositories/TransactionRepository";
import { WishlistCollectionRepository } from "../repositories/WishlistCollectionRepository";

//services
import { CartItemService } from "./CartItem.service";
import { CategoryService } from "./Category.service";
import { ImageInstanceService } from "./ImageInstance.service";
import { ProductService } from "./Product.service";
import { ReviewService } from "./Review.service";
import { TransactionService } from "./Transaction.service";
import { UserService } from "./User.service";
import { WishlistCollectionService } from "./WishlistCollection.service";
import { WishlistItemService } from "./WishlistItem.service";
import { RepositoryModule } from "../repositories/Repository.module";
@Module({
  imports: [RepositoryModule],
  exports: [
    CartItemService,
    CategoryService,
    ImageInstanceService,
    ProductService,
    ReviewService,
    TransactionService,
    UserService,
    WishlistCollectionService,
    WishlistItemService,
  ],
  providers: [
    CartItemService,
    CategoryService,
    ImageInstanceService,
    ProductService,
    ReviewService,
    TransactionService,
    UserService,
    WishlistCollectionService,
    WishlistItemService,
  ],
})
export class ServiceModule {}
