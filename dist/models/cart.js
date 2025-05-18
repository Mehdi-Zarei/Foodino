"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cartItemsSchema = new mongoose_1.default.Schema({
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
const cartSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [cartItemsSchema],
    totalCartPrice: {
        type: Number,
        required: false,
    },
}, { timestamps: true });
cartSchema.pre("save", function (next) {
    this.totalCartPrice = this.items.reduce((total, item) => {
        return total + item.priceAtTimeOfPurchase * item.quantity;
    }, 0);
    next();
});
const model = mongoose_1.default.model("Cart", cartSchema);
exports.cartModel = model;
