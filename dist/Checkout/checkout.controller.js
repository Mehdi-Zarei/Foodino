"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCheckout = exports.createCheckout = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const User_1 = require("../models/User");
const Cart_1 = require("../models/Cart");
const BaseProduct_1 = require("../models/BaseProduct");
const Checkout_1 = require("../models/Checkout");
const zarinpal_1 = require("../Service/zarinpal");
const Order_1 = require("../models/Order");
const createCheckout = async (req, res, next) => {
    try {
        const { shippingAddressID } = req.body;
        const user = req.user;
        if (!(0, mongoose_1.isValidObjectId)(shippingAddressID)) {
            res.status(409).json({ msg: "لطفا آدرس خود را وارد کنید." });
            return;
        }
        const mainUser = await User_1.userModel.findOne({ _id: user?._id });
        if (!mainUser) {
            res.status(404).json({ msg: "لطفا ابتدا وارد حساب کاربری خود شوید." });
            return;
        }
        const selectedAddress = mainUser.addresses.find((i) => {
            return i._id.equals(shippingAddressID);
        });
        if (!selectedAddress) {
            res.status(404).json({ msg: "آدرس یافت نشد." });
            return;
        }
        const userCart = await Cart_1.cartModel.findOne({ user: user?._id });
        if (!userCart || !userCart.items.length) {
            res.status(404).json({ msg: "سبد خرید شما خالی است!", userCart: [] });
            return;
        }
        const selectedProductsIDs = userCart.items.map((i) => i.product);
        const availableProducts = await BaseProduct_1.product.find({
            _id: { $in: selectedProductsIDs },
        });
        const notAvailableProductIds = availableProducts.filter((p) => p.isAvailable === false);
        if (notAvailableProductIds.length) {
            await Cart_1.cartModel.findOneAndUpdate({ user: user?._id }, {
                $pull: {
                    items: {
                        product: {
                            $in: notAvailableProductIds,
                        },
                    },
                },
            }, { new: true });
            res.status(200).json({
                msg: "محصولاتی که درحال حاضر ناموجود بودن از سبد خرید شما حذف گردیدند.",
            });
        }
        const newCheckout = new Checkout_1.checkoutModel({
            user: user?._id,
            items: userCart.items,
            shippingAddress: selectedAddress,
            totalCartPrice: userCart.totalCartPrice,
        });
        const newPayment = await (0, zarinpal_1.createPayment)({
            amountInRial: userCart.totalCartPrice,
            description: `سفارش با شماره شناسه ${newCheckout._id}`,
            mobile: user.phone,
        });
        newCheckout.authority = newPayment.authority;
        await newCheckout.save();
        res.status(201).json({
            msg: "فرایند تسویه حساب با موفقیت آغاز شد.",
            checkout: newCheckout,
            paymentUrl: newPayment.paymentUrl,
        });
        return;
    }
    catch (error) {
        next(error);
    }
};
exports.createCheckout = createCheckout;
const verifyCheckout = async (req, res, next) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { Status, Authority } = req.query;
        const hasOrderAlreadyCreated = await Order_1.orderModel
            .findOne({
            authority: Authority,
        })
            .session(session);
        if (hasOrderAlreadyCreated) {
            await session.abortTransaction();
            res.status(409).json({ mes: "این پرداخت قبلا تائید شده است." });
            return;
        }
        const isCheckoutExist = await Checkout_1.checkoutModel
            .findOne({
            authority: Authority,
        })
            .session(session);
        if (!isCheckoutExist) {
            await session.abortTransaction();
            res.status(409).json({
                msg: "تسویه حساب یافت نشد.لطفا مجدد فرایند پرداخت را شروع کنید.",
            });
            return;
        }
        if (typeof req.query.Authority !== "string") {
            await session.abortTransaction();
            res
                .status(400)
                .json({ msg: "Authority اجباری است و باید رشته متنی باشد." });
            return;
        }
        const authority = req.query.Authority;
        const verifyPaymentStatus = await (0, zarinpal_1.verifyPayment)({
            amountInRial: isCheckoutExist.totalCartPrice,
            authority,
        });
        if (![100, 101].includes(verifyPaymentStatus.code) || Status !== "OK") {
            await session.abortTransaction();
            res.status(400).json({ msg: "پرداخت تائید نشد!" });
            return;
        }
        const selectedProductsIDs = isCheckoutExist.items.map((p) => p.product.toString());
        const notAvailableProducts = await BaseProduct_1.product
            .find({
            _id: selectedProductsIDs,
            isAvailable: false,
        })
            .session(session);
        if (notAvailableProducts.length) {
            await session.abortTransaction();
            res.status(404).json({
                msg: "برخی از کالاهای سبد خرید شما موجود نبودند و حذف شدند.لطفا سبد خرید خود را بررسی نمائید.",
            });
            await Cart_1.cartModel
                .findOneAndUpdate({ user: isCheckoutExist.user }, { $pull: { items: { product: { $in: notAvailableProducts } } } })
                .session(session);
            await Checkout_1.checkoutModel.deleteOne({ _id: isCheckoutExist._id }, { session });
            return;
        }
        const newOrder = await Order_1.orderModel.create([
            {
                user: isCheckoutExist.user,
                items: isCheckoutExist.items,
                authority: isCheckoutExist.authority,
                shippingAddress: isCheckoutExist.shippingAddress,
                status: "PROCESSING",
                totalCartPrice: isCheckoutExist.totalCartPrice,
            },
        ], { session });
        await Cart_1.cartModel.findOneAndUpdate({ user: isCheckoutExist.user }, { items: [] }, { session });
        await Checkout_1.checkoutModel.deleteOne({ _id: isCheckoutExist._id }, { session });
        await session.commitTransaction();
        res.status(201).json({
            msg: "پرداخت با موفقیت انجام شد.",
            newOrder,
            transactionNumber: verifyPaymentStatus.ref_id,
        });
        return;
    }
    catch (error) {
        await session.abortTransaction();
        res.status(500).json({ msg: "خطا در عملیات پرداخت!لطفا مجدد سعی نمائید." });
        return;
    }
    finally {
        await session.endSession();
    }
};
exports.verifyCheckout = verifyCheckout;
