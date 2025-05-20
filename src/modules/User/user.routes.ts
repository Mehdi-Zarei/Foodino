import express from "express";
const router = express.Router();

//* Controller
import {
  addFavorite,
  getAll,
  getFavorite,
  getOne,
  me,
  toggleRestrict,
  update,
} from "./user.controller";

//* Middleware
import authGuard from "../../Middlewares/auth";
import { validate } from "../../Middlewares/validate";
import { updateUserSchema } from "./user.validator";

router.route("/update").patch(authGuard(), validate(updateUserSchema), update);

router.route("/").get(authGuard(["ADMIN"]), getAll);

router.route("/favorite").get(authGuard(), getFavorite);

router
  .route("/:id")
  .get(authGuard(["ADMIN"]), getOne)
  .patch(authGuard(["ADMIN"]), toggleRestrict);

router.route("/:productID/favorite").patch(authGuard(), addFavorite);

router.route("/me").get(authGuard(), me);

export default router;
