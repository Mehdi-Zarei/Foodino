import mongoose, { Types } from "mongoose";

interface IShippingAddress {
  name: string;
  postalCode: number;
  physicalAddress: string;
  _id: Types.ObjectId;
}
interface IUser {
  name: string;
  email?: string;
  phone: string;
  password?: string;
  addresses: IShippingAddress[];
  isRestrict: boolean;
  role: "ADMIN" | "USER";
  favorites?: string[];
}

const shippingAddressSchema = new mongoose.Schema<IShippingAddress>(
  {
    name: { type: String, required: true, trim: true },
    postalCode: { type: Number, required: true },
    physicalAddress: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

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
      type: [shippingAddressSchema],
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
schema.index({ email: 1, phone: 1 });

const userModel = mongoose.model<IUser>("User", schema);

export { userModel, IUser };
