"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
//* Controllers
const cart_controller_1 = require("./cart.controller");
//* Middlewares
const auth_1 = __importDefault(require("../Middlewares/auth"));
//* Routes
router.route("/").get((0, auth_1.default)(), cart_controller_1.getCart);
router.route("/:productId/add").post((0, auth_1.default)(), cart_controller_1.addToCart);
router.route("/:productId/remove").delete((0, auth_1.default)(), cart_controller_1.removeFromCart);
exports.default = router;
