"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
//* Middlewares
const auth_1 = __importDefault(require("../../Middlewares/auth"));
const validate_1 = require("../../Middlewares/validate");
const order_validator_1 = require("./order.validator");
//* Controller
const order_controller_1 = require("./order.controller");
//* Routes
router.route("/").get((0, auth_1.default)(), order_controller_1.getOrders);
router
    .route("/:id")
    .patch((0, auth_1.default)(["ADMIN"]), (0, validate_1.validate)(order_validator_1.statusSchema), order_controller_1.updateOrders);
exports.default = router;
