import { Request, Response, NextFunction, RequestHandler } from "express";
import { product } from "../models/BaseProduct";
import foodModel from "../models/FoodProducts";
import drinkModel from "../models/DrinkProduct";
import mongoose from "mongoose";

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

    if (type === "Food") {
      await foodModel.create({
        name,
        price,
        type,
        description,
        isAvailable,
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
  } catch (error) {
    next(error);
  }
};

export const remove: RequestHandler = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
