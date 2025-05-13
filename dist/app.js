"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded());
const multer_1 = __importDefault(require("multer")); //TODO
app.use((0, multer_1.default)().none());
//* Files Routes
const product_routes_1 = __importDefault(require("./Products/product.routes"));
//* Routes
app.use("/product", product_routes_1.default);
//* 404 Error Handler
app.use((req, res) => {
    res.status(404).json({ message: "Oops!Page Not Found :(( " });
});
exports.default = app;
