"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
//* Controller
const user_controller_1 = require("./user.controller");
//* Middleware
const auth_1 = __importDefault(require("../../Middlewares/auth"));
const validate_1 = require("../../Middlewares/validate");
const user_validator_1 = require("./user.validator");
router.route("/update").patch((0, auth_1.default)(), (0, validate_1.validate)(user_validator_1.updateUserSchema), user_controller_1.update);
router.route("/").get((0, auth_1.default)(["ADMIN"]), user_controller_1.getAll);
router.route("/favorite").get((0, auth_1.default)(), user_controller_1.getFavorite);
router
    .route("/:id")
    .get((0, auth_1.default)(["ADMIN"]), user_controller_1.getOne)
    .patch((0, auth_1.default)(["ADMIN"]), user_controller_1.toggleRestrict);
router.route("/:productID/favorite").patch((0, auth_1.default)(), user_controller_1.addFavorite);
router.route("/me").get((0, auth_1.default)(), user_controller_1.me);
exports.default = router;
