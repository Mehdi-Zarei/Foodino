import express from "express";
const router = express.Router();

//* Controller
import { login, logout, register, sentOtp, verifyOtp } from "./auth.controller";

//* Middleware
import authGuard from "../middlewares/auth";

//* Controller

//* Routes
router.route("/sent").post(sentOtp);
router.route("/verify").post(verifyOtp);
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(authGuard(), logout);

export default router;
