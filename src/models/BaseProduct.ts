import mongoose from "mongoose";

interface IBaseProduct {
  name: string;
  price: number;
  type: string;
  description: string;
  images: string[];
  isAvailable: boolean;
  ingredients: string[];
}

const schema = new mongoose.Schema<IBaseProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["Food", "Drink"],
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    images: {
      type: [String],
      required: false, //TODO : Change to true
    },
    isAvailable: {
      type: Boolean,
      required: true,
      default: false,
    },
    ingredients: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

const product = mongoose.model<IBaseProduct>("Products", schema);

export { product, IBaseProduct };
