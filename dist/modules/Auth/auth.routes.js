"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
//* Controller
const auth_controller_1 = require("./auth.controller");
//* Middleware
const auth_1 = __importDefault(require("../../Middlewares/auth"));
const validate_1 = require("../../Middlewares/validate");
const auth_validator_1 = require("./auth.validator");
//* Controller
//* Routes
router.route("/sent").post((0, validate_1.validate)(auth_validator_1.phoneSchema), auth_controller_1.sentOtp);
router.route("/verify").post((0, validate_1.validate)(auth_validator_1.verifyOtpSchema), auth_controller_1.verifyOtp);
router.route("/register").post((0, validate_1.validate)(auth_validator_1.createUserSchema), auth_controller_1.register);
router.route("/login").post((0, validate_1.validate)(auth_validator_1.loginSchema), auth_controller_1.login);
router.route("/logout").post((0, auth_1.default)(), auth_controller_1.logout);
router.route("/refresh").get(auth_controller_1.refreshToken);
exports.default = router;
