import { Request, Response, NextFunction, RequestHandler } from "express";
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

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {
    next(error);
  }
};

export const getOne = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {
    next(error);
  }
};
