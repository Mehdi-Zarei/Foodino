import express from "express";
const router = express.Router();

//* Controllers
import { addToCart, getCart, removeFromCart } from "./cart.controller";

//* Middlewares
import authGuard from "../../Middlewares/auth";
import { validate } from "../../Middlewares/validate";
import { productQuantitySchema } from "./cart.validator";

//* Routes
router.route("/").get(authGuard(), getCart);
router
  .route("/:productId/add")
  .post(authGuard(), validate(productQuantitySchema), addToCart);
router.route("/:productId/remove").delete(authGuard(), removeFromCart);

export default router;
