import mongoose from "mongoose";
import { product, IBaseProduct } from "./BaseProduct";

interface IFoodProduct extends IBaseProduct {
  weight: number;
  calories: number;
}

const schema = new mongoose.Schema<IFoodProduct>(
  {
    weight: {
      type: Number,
      required: true,
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
