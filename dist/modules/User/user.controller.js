"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addFavorite = exports.getFavorite = exports.update = exports.me = exports.toggleRestrict = exports.getOne = exports.getAll = void 0;
const User_1 = require("../../models/User");
const mongoose_1 = require("mongoose");
const bcryptjs_1 = require("../../utils/bcryptjs");
const BaseProduct_1 = require("../../models/BaseProduct");
const getAll = async (req, res, next) => {
    try {
        const users = await User_1.userModel.find({}).select("-password -__v").lean();
        if (!users.length) {
            res.status(404).json({ message: "کاربری یافت نشد." });
            return;
        }
        res.status(200).json(users);
        return;
    }
    catch (error) {
        next(error);
    }
};
exports.getAll = getAll;
const getOne = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            res.status(409).json({ message: "آیدی وارد شده صحیح نمی باشد." });
            return;
        }
        const mainUser = await User_1.userModel
            .findById(id)
            .select("-password -__v")
            .lean();
        if (!mainUser) {
            res.status(404).json({ mes: "کاربر یافت نشد." });
            return;
        }
        res.status(200).json(mainUser);
        return;
    }
    catch (error) {
        next(error);
    }
};
exports.getOne = getOne;
const toggleRestrict = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            res.status(409).json({ message: "آیدی وارد شده صحیح نمی باشد." });
            return;
        }
        const mainUser = await User_1.userModel.findById(id).select("-password");
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
    }
    catch (error) {
        next(error);
    }
};
exports.toggleRestrict = toggleRestrict;
const me = async (req, res, next) => {
    try {
        const user = req.user;
        const profile = await User_1.userModel
            .findById(user.id)
            .select("-password");
        res.status(200).json(profile);
        return;
    }
    catch (error) {
        next(error);
    }
};
exports.me = me;
const update = async (req, res, next) => {
    try {
        const user = req.user;
        const { name, email, password, addresses } = req.body;
        const mainUser = await User_1.userModel.findById(user._id);
        if (!mainUser) {
            res.status(404).json({ msg: "لطفا ابتدا وارد حساب کاربری خود شوید." });
            return;
        }
        if (name)
            mainUser.name = name;
        if (email)
            mainUser.email = email;
        if (addresses)
            mainUser.addresses = [...addresses];
        if (password)
            mainUser.password = await (0, bcryptjs_1.hashData)(password);
        await mainUser.save();
        res.status(200).json({ msg: "عملیات با موفقیت انجام شد." });
        return;
    }
    catch (error) {
        next(error);
    }
};
exports.update = update;
const getFavorite = async (req, res, next) => {
    try {
        const user = req.user;
        const userFavorite = await User_1.userModel
            .findOne({ _id: user?._id })
            .select("favorites");
        if (!userFavorite?.favorites?.length) {
            res.status(404).json({
                msg: "شما تاکنون محصولی را به لیست مورد علاقه ها اضافه نکرده اید.",
            });
            return;
        }
        const favoriteProducts = await BaseProduct_1.product.find({
            _id: userFavorite.favorites,
        });
        res.status(200).json(favoriteProducts);
        return;
    }
    catch (error) {
        next(error);
    }
};
exports.getFavorite = getFavorite;
const addFavorite = async (req, res, next) => {
    try {
        const { productID } = req.body;
        const user = req.user;
        if (!(0, mongoose_1.isValidObjectId)(productID)) {
            res.status(409).json({ message: "آیدی وارد شده صحیح نمی باشد." });
            return;
        }
        const isDuplicateFavorite = await User_1.userModel.findOne({
            _id: user?._id,
            favorites: productID,
        });
        if (isDuplicateFavorite) {
            res.status(409).json({
                msg: "شما این محصول را قبلا در لیست علاقه مندی های خود قرار داده اید.",
            });
            return;
        }
        const add = await User_1.userModel.findOneAndUpdate({ _id: user?._id }, { $push: { favorites: productID } });
        if (!add) {
            res.status(409).json({ msg: "محصول یافت نشد." });
            return;
        }
        res.status(200).json({
            msg: "محصول مورد نظر با موفقیت به لیست علاقه مندی ها افزوده شد..",
        });
        return;
    }
    catch (error) {
        next(error);
    }
};
exports.addFavorite = addFavorite;
