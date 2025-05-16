import { RequestHandler } from "express";
import mongoose from "mongoose";
import { product } from "../models/BaseProduct";
import foodModel from "../models/FoodProducts";
import drinkModel from "../models/DrinkProduct";

export const createOne: RequestHandler = async (req, res, next) => {
  try {
    const {
      name,
      price,
      type,
      description,
      isAvailable,
      ingredients,
      calories,
      weight,
      volume,
      caffeineLevel,
    } = req.body;

    const existProduct = await product.findOne({ name, price, type }).lean();

    if (existProduct) {
      res.status(409).json({ message: "این محصول از قبل وجود دارد." });
      return;
    }

    const productImages = (req.files as Express.Multer.File[])?.map(
      (img) => `public/images/${img.filename}`
    );

    if (type === "Food") {
      await foodModel.create({
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
    } else if (type === "Drink") {
      await drinkModel.create({
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
    } else {
      res
        .status(409)
        .json({ message: "لطفا نوع غذا یا نوشیدنی را مشخص کنید." });
      return;
    }

    res.status(201).json({ message: "محصول مورد نظر با موفقیت ثبت گردید." });
    return;
  } catch (error) {
    next(error);
  }
};

export const getAll: RequestHandler = async (req, res, next) => {
  try {
    const products = await product.find({}).lean();

    if (!product.length) {
      res.status(404).json({ message: "هیچ محصولی پیدا نشد." });
      return;
    }
    res.status(200).json(products);

    return;
  } catch (error) {
    next(error);
  }
};

export const getOne: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(409).json({ message: "آیدی وارد شده معتبر نمی باشد." });
      return;
    }

    const mainProduct = await product.findById(id).lean();

    if (!mainProduct) {
      res.status(404).json({ message: "هیچ محصولی یافت نشد!" });
      return;
    }

    res.status(200).json(mainProduct);
    return;
  } catch (error) {
    next(error);
  }
};

export const update: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      price,
      type,
      description,
      isAvailable,
      ingredients,
      calories,
      weight,
      volume,
      caffeineLevel,
    } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      res.status(409).json({ message: "آیدی وارد شده صحیح نمی باشد." });
      return;
    }

    const mainProduct = await product.findOne({ _id: id });

    if (!mainProduct) {
      res.status(404).json({ message: "محصولی برای آپدیت یافت نشد." });
      return;
    }

    if (req.files?.length) {
      mainProduct.images = (req.files as Express.Multer.File[])?.map(
        (img) => `public/images/${img.filename}`
      );
    }

    if (name) mainProduct.name = name;
    if (price) mainProduct.price = price;
    if (type) mainProduct.type = type;
    if (description) mainProduct.description = description;
    if (isAvailable) mainProduct.isAvailable = isAvailable;
    if (ingredients) mainProduct.ingredients = ingredients;

    await mainProduct.save();

    switch (mainProduct.__t) {
      case "FoodProduct": {
        const food = await foodModel.findById(id);
        if (!food) break;

        if (calories) food.calories = calories;
        if (weight) food.weight = weight;

        await food.save();
        break;
      }
      case "DrinkProduct": {
        const drink = await drinkModel.findById(id);
        if (!drink) break;

        if (volume) drink.volume = volume;
        if (caffeineLevel) drink.caffeineLevel = caffeineLevel;

        await drink.save();
        break;
      }
      default:
        res.status(400).json({ message: "نوع محصول ناشناخته است." });
        break;
    }

    res.status(200).json({ message: "محصول مورد نظر با موفقیت آپدیت شد." });
    return;
  } catch (error) {
    next(error);
  }
};

export const remove: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(409).json({ message: "آیدی وارد شده معتبر نمی باشد." });
      return;
    }

    const remove = await product.findByIdAndDelete(id);

    if (!remove) {
      res.status(404).json({ message: "هیچ محصولی یافت نشد." });
      return;
    }

    res.status(200).json({ message: "محصول مورد نظر با موفقیت حذف شد." });
    return;
  } catch (error) {
    next(error);
  }
};
