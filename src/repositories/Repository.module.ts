import { Module } from "@nestjs/common";

import { CategoryRepository } from "./CategoryRepository";
import { CartItemRepository } from "./CartItemRepository";
import { ImageRepository } from "./ImageRepository";
import { ProductRepository } from "./ProductRepository";
import { ReviewRepository } from "./ReviewRepository";
import { TransactionRepository } from "./TransactionRepository";
import { UserRepository } from "./UserRepository";
import { WishlistItemRepository } from "./WishlistItemRepository";
import { WishlistCollectionRepository } from "./WishlistCollectionRepository";

@Module({
  providers: [
    CategoryRepository,
    CartItemRepository,
    ImageRepository,
    ProductRepository,
    ReviewRepository,
    TransactionRepository,
    UserRepository,
    WishlistItemRepository,
    WishlistCollectionRepository,
  ],
  exports: [
    CategoryRepository,
    CartItemRepository,
    ImageRepository,
    ProductRepository,
    ReviewRepository,
    TransactionRepository,
    UserRepository,
    WishlistItemRepository,
    WishlistCollectionRepository,
  ],
})
export class RepositoryModule {}
