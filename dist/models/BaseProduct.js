"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.product = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    price: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum: ["Food", "Drink"],
        required: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500,
    },
    images: {
        type: [String],
        required: true,
    },
    isAvailable: {
        type: Boolean,
        required: true,
        default: false,
    },
    ingredients: {
        type: [String],
        required: true,
    },
}, { timestamps: true });
const product = mongoose_1.default.model("Products", schema);
exports.product = product;
