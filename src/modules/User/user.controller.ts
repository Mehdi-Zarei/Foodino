import { RequestHandler } from "express";
import { IUser, userModel } from "../../models/User";
import { isValidObjectId, Types } from "mongoose";
import { hashData } from "../../utils/bcryptjs";
import { product } from "../../models/BaseProduct";

interface ICustomRequest {
  user?: IUser & { _id: Types.ObjectId };
}

export const getAll: RequestHandler = async (req, res, next) => {
  try {
    const users = await userModel.find({}).select("-password -__v").lean();

    if (!users.length) {
      res.status(404).json({ message: "کاربری یافت نشد." });
      return;
    }

    res.status(200).json(users);
    return;
  } catch (error) {
    next(error);
  }
};

export const getOne: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      res.status(409).json({ message: "آیدی وارد شده صحیح نمی باشد." });
      return;
    }

    const mainUser = await userModel
      .findById(id)
      .select("-password -__v")
      .lean();

    if (!mainUser) {
      res.status(404).json({ mes: "کاربر یافت نشد." });
      return;
    }

    res.status(200).json(mainUser);
    return;
  } catch (error) {
    next(error);
  }
};

export const toggleRestrict: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      res.status(409).json({ message: "آیدی وارد شده صحیح نمی باشد." });
      return;
    }

    const mainUser = await userModel.findById(id).select("-password");
    if (!mainUser) {
      res.status(404).json({ msg: "کاربر یافت نشد." });
      return;
    }

    mainUser.isRestrict === true
      ? (mainUser.isRestrict = false)
      : (mainUser.isRestrict = true);

    mainUser.save();

    res.status(200).json({ msg: "عملیات با موفقیت انجام شد.", mainUser });
    return;
  } catch (error) {
    next(error);
  }
};

export const me: RequestHandler = async (req, res, next) => {
  try {
    const user = (req as ICustomRequest).user;

    const profile = await userModel
      .findById((user as any).id)
      .select("-password");

    res.status(200).json(profile);
    return;
  } catch (error) {
    next(error);
  }
};

export const update: RequestHandler = async (req, res, next) => {
  try {
    const user = (req as ICustomRequest).user;

    const { name, email, password, addresses } = req.body;

    const mainUser = await userModel.findById((user as any)._id);

    if (!mainUser) {
      res.status(404).json({ msg: "لطفا ابتدا وارد حساب کاربری خود شوید." });
      return;
    }

    if (name) mainUser.name = name;
    if (email) mainUser.email = email;
    if (addresses) mainUser.addresses = [...addresses];
    if (password) mainUser.password = await hashData(password);

    await mainUser.save();

    res.status(200).json({ msg: "عملیات با موفقیت انجام شد." });
    return;
  } catch (error) {
    next(error);
  }
};

export const getFavorite: RequestHandler = async (req, res, next) => {
  try {
    const user = (req as ICustomRequest).user;

    const userFavorite = await userModel
      .findOne({ _id: user?._id })
      .select("favorites");

    if (!userFavorite?.favorites?.length) {
      res.status(404).json({
        msg: "شما تاکنون محصولی را به لیست مورد علاقه ها اضافه نکرده اید.",
      });
      return;
    }

    const favoriteProducts = await product.find({
      _id: userFavorite.favorites,
    });

    res.status(200).json(favoriteProducts);
    return;
  } catch (error) {
    next(error);
  }
};

export const addFavorite: RequestHandler = async (req, res, next) => {
  try {
    const { productID } = req.body;
    const user = (req as ICustomRequest).user;

    if (!isValidObjectId(productID)) {
      res.status(409).json({ message: "آیدی وارد شده صحیح نمی باشد." });
      return;
    }

    const isDuplicateFavorite = await userModel.findOne({
      _id: user?._id,
      favorites: productID,
    });

    if (isDuplicateFavorite) {
      res.status(409).json({
        msg: "شما این محصول را قبلا در لیست علاقه مندی های خود قرار داده اید.",
      });
      return;
    }

    const add = await userModel.findOneAndUpdate(
      { _id: user?._id },
      { $push: { favorites: productID } }
    );

    if (!add) {
      res.status(409).json({ msg: "محصول یافت نشد." });
      return;
    }

    res.status(200).json({
      msg: "محصول مورد نظر با موفقیت به لیست علاقه مندی ها افزوده شد..",
    });
    return;
  } catch (error) {
    next(error);
  }
};
