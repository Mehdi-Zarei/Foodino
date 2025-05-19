"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkout_controller_1 = require("./checkout.controller");
const auth_1 = __importDefault(require("../Middlewares/auth"));
const router = express_1.default.Router();
//* Routes
router.route("/").post((0, auth_1.default)(), checkout_controller_1.createCheckout);
router.route("/verify").get((0, auth_1.default)(), checkout_controller_1.verifyCheckout);
exports.default = router;
