import express from "express";
const router = express.Router();

//* Middlewares
import authGuard from "../../Middlewares/auth";
import { validate } from "../../Middlewares/validate";
import { statusSchema } from "./order.validator";

//* Controller
import { getOrders, updateOrders } from "./order.controller";

//* Routes

router.route("/").get(authGuard(), getOrders);
router
  .route("/:id")
  .patch(authGuard(["ADMIN"]), validate(statusSchema), updateOrders);

export default router;
