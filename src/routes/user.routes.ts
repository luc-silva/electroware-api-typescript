import { Router } from "express";
import {
  addFunds,
  deleteAccount,
  getEveryUserCollectionOwned,
  getProfileInfo,
  getUserPrivateInfo,
  getUserProducts,
  getUserPublicCollections,
  loginUser,
  registerUser,
  updateUserEmail,
  updateUserInfo,
  updateUserPassword,
} from "../controllers/userController";
import {
  getEveryUserReviews,
  getReviewsFromUserProducts,
} from "../controllers/reviewsController";
import { protectedRoute } from "../middleware/auth";
import { getUserTransactions } from "../controllers/transactionController";

export const userRouter = Router();
userRouter.post("/user/login", loginUser);
userRouter.post("/user/register", registerUser);

userRouter.get("/user/:id", getProfileInfo);
userRouter.get("/user/:id/products", getUserProducts);
userRouter.get("/user/:id/reviews", getEveryUserReviews);
userRouter.get("/user/:id/products/reviews", getReviewsFromUserProducts);
userRouter.get("/user/:id/collections", getUserPublicCollections);

//protected
userRouter.get("/user/private/:id", protectedRoute, getUserPrivateInfo);
userRouter.get("/user/:id/transactions", protectedRoute, getUserTransactions);
userRouter.get(
  "/user/:id/private/collections",
  protectedRoute,
  getEveryUserCollectionOwned
);
userRouter.put("/user/:id", protectedRoute, updateUserInfo);
userRouter.patch("/user/billings/add", protectedRoute, addFunds);
userRouter.patch(
  "/user/private/details/password",
  protectedRoute,
  updateUserPassword
);
userRouter.patch(
  "/user/private/details/email",
  protectedRoute,
  updateUserEmail
);
userRouter.delete("/user/:id", protectedRoute, deleteAccount);
