import mongoose from "mongoose";

interface IBaseProduct {
  name: string;
  price: number;
  type: string;
  description: string;
  images: string[];
  available: boolean;
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
      minlength: 20,
      maxlength: 500,
    },
    images: {
      type: [String],
      required: true,
    },
    available: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const product = mongoose.model<IBaseProduct>("Products", schema);

export { product, IBaseProduct };
