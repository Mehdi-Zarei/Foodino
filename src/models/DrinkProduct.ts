import mongoose from "mongoose";
import { product, IBaseProduct } from "./BaseProduct";

interface IDrinkProduct extends IBaseProduct {
  volume: number;
  caffeineLevel?: number;
}

const schema = new mongoose.Schema<IDrinkProduct>(
  {
    volume: {
      type: Number,
      required: true,
    },
    caffeineLevel: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const drinkProduct = product.discriminator<IDrinkProduct>(
  "DrinkProduct",
  schema
);

export default drinkProduct;
