"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const BaseProduct_1 = require("./BaseProduct");
const schema = new mongoose_1.default.Schema({
    volume: {
        type: Number,
        required: true,
    },
    caffeineLevel: {
        type: Number,
        required: false,
    },
}, { timestamps: true });
const drinkProduct = BaseProduct_1.product.discriminator("DrinkProduct", schema);
exports.default = drinkProduct;
