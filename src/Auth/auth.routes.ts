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
import authGuard from "../Middlewares/auth";

//* Controller

//* Routes
router.route("/sent").post(sentOtp);
router.route("/verify").post(verifyOtp);
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(authGuard(), logout);
router.route("/refresh").get(refreshToken);

export default router;
