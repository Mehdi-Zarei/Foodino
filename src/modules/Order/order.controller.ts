import { RequestHandler } from "express";
import { isValidObjectId, Types } from "mongoose";
import { orderModel } from "../../models/Order";

interface ICustomRequest {
  user?: {
    _id: Types.ObjectId;
    role: string;
  };
}
export const getOrders: RequestHandler = async (req, res, next) => {
  try {
    const user = (req as ICustomRequest).user;
    const filter = user?.role === "ADMIN" ? {} : { user: user?._id };

    const orders = await orderModel
      .find(filter)
      .populate("user", "-password")
      .lean();

    if (!orders.length) {
      res.status(404).json({ msg: "فعلا هیچ سفارشی ثبت نشده است." });
      return;
    }

    res.status(200).json({ orders });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateOrders: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!isValidObjectId(id)) {
      res.status(409).json({ msg: "لطفا شناسه دقیق سفارش را وارد نمائید." });
      return;
    }

    const update = await orderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!update) {
      res.status(404).json({ msg: "سفارشی جهت بروزرسانی یافت نشد." });
      return;
    }
    res.status(200).json({ msg: "عملیات با موفقیت انجام شد.", update });
    return;
  } catch (error) {
    next(error);
  }
};
