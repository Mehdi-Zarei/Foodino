"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const orderItemSchema = new mongoose_1.default.Schema({
    product: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    priceAtTimeOfPurchase: {
        type: Number,
        required: true,
    },
}, { timestamps: true });
const shippingAddressSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, trim: true },
    postalCode: { type: Number, required: true },
    physicalAddress: { type: String, required: true, trim: true },
}, { timestamps: true });
const orderSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [orderItemSchema],
    shippingAddress: [shippingAddressSchema],
    postTrackingCode: {
        type: Number,
    },
    status: {
        type: String,
        enum: ["PROCESSING", "SHIPPED", "DELIVERED"],
        default: "PROCESSING",
    },
    authority: {
        type: String,
        unique: true,
        required: true,
    },
    totalCartPrice: {
        type: Number,
        required: true,
        default: 0,
    },
}, { timestamps: true });
const model = mongoose_1.default.model("Order", orderSchema);
exports.orderModel = model;
