"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
//* Middleware
const auth_1 = __importDefault(require("../../Middlewares/auth"));
//* Controller
const checkout_controller_1 = require("./checkout.controller");
//* Routes
router.route("/").post((0, auth_1.default)(), checkout_controller_1.createCheckout);
router.route("/verify").get((0, auth_1.default)(), checkout_controller_1.verifyCheckout);
exports.default = router;
