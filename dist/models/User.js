"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const shippingAddressSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, trim: true },
    postalCode: { type: Number, required: true },
    physicalAddress: { type: String, required: true, trim: true },
}, { timestamps: true });
const schema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: false,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: false,
    },
    addresses: {
        type: [shippingAddressSchema],
        required: true,
        unique: true,
    },
    isRestrict: {
        type: Boolean,
        required: true,
        default: false,
    },
    role: {
        type: String,
        enum: ["ADMIN", "USER"],
        required: true,
        default: "USER",
    },
    favorites: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
}, { timestamps: true });
schema.index({ email: 1, phone: 1 });
const userModel = mongoose_1.default.model("User", schema);
exports.userModel = userModel;
