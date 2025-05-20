import express from "express";
const router = express.Router();

//* Controller
import {
  login,
  logout,
  register,
  sentOtp,
  verifyOtp,
  refreshToken,
} from "./auth.controller";

//* Middleware
import authGuard from "../../Middlewares/auth";
import { validate } from "../../Middlewares/validate";
import {
  createUserSchema,
  phoneSchema,
  verifyOtpSchema,
  loginSchema,
} from "./auth.validator";

//* Controller

//* Routes
router.route("/sent").post(validate(phoneSchema), sentOtp);
router.route("/verify").post(validate(verifyOtpSchema), verifyOtp);
router.route("/register").post(validate(createUserSchema), register);
router.route("/login").post(validate(loginSchema), login);
router.route("/logout").post(authGuard(), logout);
router.route("/refresh").get(refreshToken);

export default router;
