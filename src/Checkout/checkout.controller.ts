import { RequestHandler } from "express";
import mongoose, { isValidObjectId, Types } from "mongoose";
import { userModel } from "../models/User";
import { cartModel } from "../models/Cart";
import { product } from "../models/BaseProduct";
import { checkoutModel } from "../models/Checkout";
import { createPayment, verifyPayment } from "../Service/zarinpal";
import { orderModel } from "../models/Order";

interface ICustomRequest {
  user?: {
    _id: Types.ObjectId;
    phone: string;
  };
}

export const createCheckout: RequestHandler = async (req, res, next) => {
  try {
    const { shippingAddressID } = req.body;
    const user = (req as ICustomRequest).user;

    if (!isValidObjectId(shippingAddressID)) {
      res.status(409).json({ msg: "لطفا آدرس خود را وارد کنید." });
      return;
    }

    const mainUser = await userModel.findOne({ _id: user?._id });
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

    const userCart = await cartModel.findOne({ user: user?._id });

    if (!userCart || !userCart.items.length) {
      res.status(404).json({ msg: "سبد خرید شما خالی است!", userCart: [] });
      return;
    }

    const selectedProductsIDs = userCart.items.map((i) => i.product);

    const availableProducts = await product.find({
      _id: { $in: selectedProductsIDs },
    });

    const notAvailableProductIds = availableProducts.filter(
      (p) => p.isAvailable === false
    );

    if (notAvailableProductIds.length) {
      await cartModel.findOneAndUpdate(
        { user: user?._id },
        {
          $pull: {
            items: {
              product: {
                $in: notAvailableProductIds,
              },
            },
          },
        },
        { new: true }
      );
      res.status(200).json({
        msg: "محصولاتی که درحال حاضر ناموجود بودن از سبد خرید شما حذف گردیدند.",
      });
    }

    const newCheckout = new checkoutModel({
      user: user?._id,
      items: userCart.items,
      shippingAddress: selectedAddress,
      totalCartPrice: userCart.totalCartPrice,
    });

    const newPayment = await createPayment({
      amountInRial: userCart.totalCartPrice,
      description: `سفارش با شماره شناسه ${newCheckout._id}`,
      mobile: user!.phone,
    });

    newCheckout.authority = newPayment.authority;

    await newCheckout.save();

    res.status(201).json({
      msg: "فرایند تسویه حساب با موفقیت آغاز شد.",
      checkout: newCheckout,
      paymentUrl: newPayment.paymentUrl,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const verifyCheckout: RequestHandler = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { Status, Authority } = req.query;

    const hasOrderAlreadyCreated = await orderModel
      .findOne({
        authority: Authority,
      })
      .session(session);

    if (hasOrderAlreadyCreated) {
      await session.abortTransaction();
      res.status(409).json({ mes: "این پرداخت قبلا تائید شده است." });
      return;
    }

    const isCheckoutExist = await checkoutModel
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
    const authority = req.query.Authority as string;

    const verifyPaymentStatus = await verifyPayment({
      amountInRial: isCheckoutExist.totalCartPrice,
      authority,
    });

    if (![100, 101].includes(verifyPaymentStatus.code) || Status !== "OK") {
      await session.abortTransaction();
      res.status(400).json({ msg: "پرداخت تائید نشد!" });
      return;
    }

    const selectedProductsIDs = isCheckoutExist.items.map((p) =>
      p.product.toString()
    );

    const notAvailableProducts = await product
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

      await cartModel
        .findOneAndUpdate(
          { user: isCheckoutExist.user },
          { $pull: { items: { product: { $in: notAvailableProducts } } } }
        )
        .session(session);

      await checkoutModel.deleteOne({ _id: isCheckoutExist._id }, { session });
      return;
    }

    const newOrder = await orderModel.create(
      [
        {
          user: isCheckoutExist.user,
          items: isCheckoutExist.items,
          authority: isCheckoutExist.authority,
          shippingAddress: isCheckoutExist.shippingAddress,
          status: "PROCESSING",
          totalCartPrice: isCheckoutExist.totalCartPrice,
        },
      ],
      { session }
    );

    await cartModel.findOneAndUpdate(
      { user: isCheckoutExist.user },
      { items: [] },
      { session }
    );

    await checkoutModel.deleteOne({ _id: isCheckoutExist._id }, { session });

    await session.commitTransaction();

    res.status(201).json({
      msg: "پرداخت با موفقیت انجام شد.",
      newOrder,
      transactionNumber: verifyPaymentStatus.ref_id,
    });
    return;
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ msg: "خطا در عملیات پرداخت!لطفا مجدد سعی نمائید." });
    return;
  } finally {
    await session.endSession();
  }
};
