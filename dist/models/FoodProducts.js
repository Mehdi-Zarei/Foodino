"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const BaseProduct_1 = require("./BaseProduct");
const schema = new mongoose_1.default.Schema({
    weight: {
        type: Number,
        required: true,
    },
    calories: {
        type: Number,
        required: true,
    },
}, { timestamps: true });
const foodProduct = BaseProduct_1.product.discriminator("FoodProduct", schema);
exports.default = foodProduct;
