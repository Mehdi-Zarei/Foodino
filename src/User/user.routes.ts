import express from "express";
const router = express.Router();

//* Controller
import { getAll, getOne, me, toggleRestrict, update } from "./user.controller";

//* Middleware
import authGuard from "../Middlewares/auth";

router.route("/update").patch(authGuard(), update);

router.route("/").get(authGuard(["ADMIN"]), getAll);

router
  .route("/:id")
  .get(authGuard(["ADMIN"]), getOne)
  .patch(authGuard(["ADMIN"]), toggleRestrict);

router.route("/me").get(authGuard(), me);

export default router;
