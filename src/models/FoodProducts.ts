import mongoose from "mongoose";
import { product, IBaseProduct } from "./BaseProduct";

interface IFoodProduct extends IBaseProduct {
  ingredients: string[];
  calories: number;
}

const schema = new mongoose.Schema<IFoodProduct>(
  {
    ingredients: {
      type: [String],
      required: true,
      trim: true,
    },
    calories: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const foodProduct = product.discriminator<IFoodProduct>("FoodProduct", schema);

export default foodProduct;
