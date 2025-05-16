import express from "express";
import { sentOtp, verifyOtp, register, login, logout } from "./auth.controller";
const router = express.Router();

//* Controller

//* Routes
router.route("/sent").post(sentOtp);
router.route("/verify").post(verifyOtp);
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(logout);

export default router;
