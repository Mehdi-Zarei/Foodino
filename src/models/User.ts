import mongoose from "mongoose";

interface IUser {
  name: string;
  email?: string;
  phone: string;
  password?: string;
  addresses: string[];
  isRestrict: boolean;
  role: "ADMIN" | "USER";
  favorites?: string[];
}

const schema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    addresses: {
      type: [String],
      required: true,
      unique: true,
    },
    isRestrict: {
      type: Boolean,
      required: true,
      default: false,
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      required: true,
      default: "USER",
    },
    favorites: {
      type: [String],
      required: false,
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model<IUser>("User", schema);

export default userModel;
