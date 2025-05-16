"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.getOne = exports.getAll = exports.createOne = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const BaseProduct_1 = require("../models/BaseProduct");
const FoodProducts_1 = __importDefault(require("../models/FoodProducts"));
const DrinkProduct_1 = __importDefault(require("../models/DrinkProduct"));
const createOne = async (req, res, next) => {
    try {
        const { name, price, type, description, isAvailable, ingredients, calories, weight, volume, caffeineLevel, } = req.body;
        const existProduct = await BaseProduct_1.product.findOne({ name, price, type }).lean();
        if (existProduct) {
            res.status(409).json({ message: "این محصول از قبل وجود دارد." });
            return;
        }
        const productImages = req.files?.map((img) => `public/images/${img.filename}`);
        if (type === "Food") {
            await FoodProducts_1.default.create({
                name,
                price,
                type,
                description,
                isAvailable,
                images: productImages,
                ingredients,
                calories,
                weight,
            });
        }
        else if (type === "Drink") {
            await DrinkProduct_1.default.create({
                name,
                price,
                type,
                description,
                isAvailable,
                images: productImages,
                ingredients,
                volume,
                caffeineLevel,
            });
        }
        else {
            res
                .status(409)
                .json({ message: "لطفا نوع غذا یا نوشیدنی را مشخص کنید." });
            return;
        }
        res.status(201).json({ message: "محصول مورد نظر با موفقیت ثبت گردید." });
        return;
    }
    catch (error) {
        next(error);
    }
};
exports.createOne = createOne;
const getAll = async (req, res, next) => {
    try {
        const products = await BaseProduct_1.product.find({}).lean();
        if (!BaseProduct_1.product.length) {
            res.status(404).json({ message: "هیچ محصولی پیدا نشد." });
            return;
        }
        res.status(200).json(products);
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
        if (!mongoose_1.default.isValidObjectId(id)) {
            res.status(409).json({ message: "آیدی وارد شده معتبر نمی باشد." });
            return;
        }
        const mainProduct = await BaseProduct_1.product.findById(id).lean();
        if (!mainProduct) {
            res.status(404).json({ message: "هیچ محصولی یافت نشد!" });
            return;
        }
        res.status(200).json(mainProduct);
        return;
    }
    catch (error) {
        next(error);
    }
};
exports.getOne = getOne;
const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, price, type, description, isAvailable, ingredients, calories, weight, volume, caffeineLevel, } = req.body;
        if (!mongoose_1.default.isValidObjectId(id)) {
            res.status(409).json({ message: "آیدی وارد شده صحیح نمی باشد." });
            return;
        }
        const mainProduct = await BaseProduct_1.product.findOne({ _id: id });
        if (!mainProduct) {
            res.status(404).json({ message: "محصولی برای آپدیت یافت نشد." });
            return;
        }
        if (req.files) {
        }
        if (name)
            mainProduct.name = name;
        if (price)
            mainProduct.price = price;
        if (type)
            mainProduct.type = type;
        if (description)
            mainProduct.description = description;
        if (isAvailable)
            mainProduct.isAvailable = isAvailable;
        if (ingredients)
            mainProduct.ingredients = ingredients;
        await mainProduct.save();
        switch (mainProduct.__t) {
            case "FoodProduct": {
                const food = await FoodProducts_1.default.findById(id);
                if (!food)
                    break;
                if (calories)
                    food.calories = calories;
                if (weight)
                    food.weight = weight;
                await food.save();
                break;
            }
            case "DrinkProduct": {
                const drink = await DrinkProduct_1.default.findById(id);
                if (!drink)
                    break;
                if (volume)
                    drink.volume = volume;
                if (caffeineLevel)
                    drink.caffeineLevel = caffeineLevel;
                await drink.save();
                break;
            }
            default:
                res.status(400).json({ message: "نوع محصول ناشناخته است." });
                break;
        }
        res.status(200).json({ message: "محصول مورد نظر با موفقیت آپدیت شد." });
        return;
    }
    catch (error) {
        next(error);
    }
};
exports.update = update;
const remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.isValidObjectId(id)) {
            res.status(409).json({ message: "آیدی وارد شده معتبر نمی باشد." });
            return;
        }
        const remove = await BaseProduct_1.product.findByIdAndDelete(id);
        if (!remove) {
            res.status(404).json({ message: "هیچ محصولی یافت نشد." });
            return;
        }
        res.status(200).json({ message: "محصول مورد نظر با موفقیت حذف شد." });
        return;
    }
    catch (error) {
        next(error);
    }
};
exports.remove = remove;
