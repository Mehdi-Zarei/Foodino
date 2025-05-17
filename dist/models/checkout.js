"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkoutModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const checkoutItemsSchema = new mongoose_1.default.Schema({
    product: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
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
const checkoutSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [checkoutItemsSchema],
    shippingAddress: [shippingAddressSchema],
    authority: {
        type: String,
        required: true,
    },
    totalCartPrice: {
        type: Number,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        default: () => Date.now() + 60 * 60 * 1000,
    },
}, { timestamps: true });
//* TTL
checkoutSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
const model = mongoose_1.default.model("Checkout", checkoutSchema);
exports.checkoutModel = model;
