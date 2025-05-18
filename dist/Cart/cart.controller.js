"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromCart = exports.addToCart = exports.getCart = void 0;
const Cart_1 = require("../models/Cart");
const mongoose_1 = require("mongoose");
const BaseProduct_1 = require("../models/BaseProduct");
const getCart = async (req, res, next) => {
    try {
        const userID = req.user._id;
        let userCart = await Cart_1.cartModel.findOne({ user: userID }); //TODO Populate
        if (!userCart) {
            res.status(404).json({ msg: "سبد خرید شما خالی است.", userCart: [] });
            return;
        }
        res.status(200).json({ userCart });
        return;
    }
    catch (error) {
        next(error);
    }
};
exports.getCart = getCart;
const addToCart = async (req, res, next) => {
    try {
        const userID = req.user._id;
        const { productId } = req.params;
        const { quantity } = req.body;
        if (!(0, mongoose_1.isValidObjectId)(productId)) {
            res.status(409).json({ msg: "شناسه محصول معتبر نمی باشد." });
            return;
        }
        const mainProduct = await BaseProduct_1.product.findOne({ _id: productId }).lean();
        if (!mainProduct) {
            res.status(404).json({ msg: "محصولی یافت نشد." });
            return;
        }
        if (!mainProduct.isAvailable) {
            res
                .status(404)
                .json({ msg: "موجودی محصول مورد نظر به اتمام رسیده است." });
            return;
        }
        let userCart = await Cart_1.cartModel.findOne({ user: userID });
        const newItems = [
            {
                product: mainProduct._id,
                quantity,
                priceAtTimeOfPurchase: mainProduct.price,
            },
        ];
        const existingCart = await Cart_1.cartModel.findOne({
            user: userID,
            items: {
                $elemMatch: {
                    product: productId,
                    priceAtTimeOfPurchase: mainProduct.price,
                },
            },
        });
        if (!userCart) {
            userCart = new Cart_1.cartModel({
                user: userID,
                items: newItems,
            });
        }
        else if (existingCart) {
            await Cart_1.cartModel.updateOne({ user: userID, "items.product": productId }, {
                $inc: {
                    "items.$.quantity": 1,
                    totalCartPrice: mainProduct.price * 1,
                },
            });
        }
        else {
            userCart.items.push(...newItems);
        }
        await userCart.save();
        res
            .status(200)
            .json({ msg: "محصول مورد نظر با موفقیت به سبد خرید شما اضافه گردید." });
        return;
    }
    catch (error) {
        next(error);
    }
};
exports.addToCart = addToCart;
const removeFromCart = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const userID = req.user?._id;
        if (!(0, mongoose_1.isValidObjectId)(productId)) {
            res.status(409).json({ msg: "شناسه محصول معتبر نمی باشد." });
            return;
        }
        const userCart = await Cart_1.cartModel.findOne({ user: userID });
        if (!userCart) {
            res.status(404).json({ msg: "سبد خرید شما خالی می باشد.", userCart: [] });
            return;
        }
        const itemIndex = userCart.items.findIndex((item) => item.product.toString() === productId);
        if (itemIndex === -1) {
            res.status(404).json({ msg: "محصول در سبد خرید وجود ندارد" });
            return;
        }
        const item = userCart.items[itemIndex];
        if (item.quantity === 1) {
            userCart.items.splice(itemIndex, 1);
        }
        else {
            userCart.items[itemIndex].quantity -= 1;
        }
        userCart.totalCartPrice -= item.priceAtTimeOfPurchase;
        await userCart.save();
        res
            .status(200)
            .json({ msg: "محصول مورد نظر با موفقیت از سبد خرید شما حذف شد" });
        return;
    }
    catch (error) {
        next(error);
    }
};
exports.removeFromCart = removeFromCart;
