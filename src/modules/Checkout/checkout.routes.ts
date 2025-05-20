import express from "express";
const router = express.Router();

//* Middleware
import authGuard from "../../Middlewares/auth";

//* Controller
import { createCheckout, verifyCheckout } from "./checkout.controller";

//* Routes

router.route("/").post(authGuard(), createCheckout);
router.route("/verify").get(authGuard(), verifyCheckout);

export default router;
