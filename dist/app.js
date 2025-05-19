"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const Error_Handler_1 = require("./Middlewares/Error Handler");
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use("/public", express_1.default.static(path_1.default.join(__dirname, "..", "public")));
app.use((0, cookie_parser_1.default)());
//* Files Routes
const product_routes_1 = __importDefault(require("./Products/product.routes"));
const auth_routes_1 = __importDefault(require("./Auth/auth.routes"));
const user_routes_1 = __importDefault(require("./User/user.routes"));
const cart_routes_1 = __importDefault(require("./Cart/cart.routes"));
const checkout_routes_1 = __importDefault(require("./Checkout/checkout.routes"));
//* Routes
app.use("/api/product", product_routes_1.default);
app.use("/api/auth", auth_routes_1.default);
app.use("/api/user/cart", cart_routes_1.default);
app.use("/api/user", user_routes_1.default);
app.use("/api/checkouts", checkout_routes_1.default);
//* 404 Error Handler
app.use((req, res) => {
    res.status(404).json({ message: "Oops!Page Not Found :(( " });
});
//* Global Error Handler
app.use(Error_Handler_1.errorHandler);
exports.default = app;
