"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
        minlength: 20,
        maxlength: 500,
    },
    images: {
        type: [String],
        required: true,
    },
    available: {
        type: Boolean,
        required: true,
        default: false,
    },
}, { timestamps: true });
const model = mongoose_1.default.model("Products", schema);
exports.default = model;
