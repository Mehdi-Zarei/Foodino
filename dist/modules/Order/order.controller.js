"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrders = exports.getOrders = void 0;
const mongoose_1 = require("mongoose");
const Order_1 = require("../../models/Order");
const getOrders = async (req, res, next) => {
    try {
        const user = req.user;
        const filter = user?.role === "ADMIN" ? {} : { user: user?._id };
        const orders = await Order_1.orderModel
            .find(filter)
            .populate("user", "-password")
            .lean();
        if (!orders.length) {
            res.status(404).json({ msg: "فعلا هیچ سفارشی ثبت نشده است." });
            return;
        }
        res.status(200).json({ orders });
        return;
    }
    catch (error) {
        next(error);
    }
};
exports.getOrders = getOrders;
const updateOrders = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            res.status(409).json({ msg: "لطفا شناسه دقیق سفارش را وارد نمائید." });
            return;
        }
        const update = await Order_1.orderModel.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
        if (!update) {
            res.status(404).json({ msg: "سفارشی جهت بروزرسانی یافت نشد." });
            return;
        }
        res.status(200).json({ msg: "عملیات با موفقیت انجام شد.", update });
        return;
    }
    catch (error) {
        next(error);
    }
};
exports.updateOrders = updateOrders;
