import mongoose, { Types } from "mongoose";

interface IOrderItem {
  product: Types.ObjectId;
  quantity: number;
  priceAtTimeOfPurchase: number;
}
interface IShippingAddress {
  name: string;
  postalCode: number;
  physicalAddress: string;
}

interface IOrder {
  user: Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IShippingAddress[];
  status: string;
  authority: string;
  totalCartPrice: number;
}

const orderItemSchema = new mongoose.Schema<IOrderItem>(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    priceAtTimeOfPurchase: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const shippingAddressSchema = new mongoose.Schema<IShippingAddress>(
  {
    name: { type: String, required: true, trim: true },
    postalCode: { type: Number, required: true },
    physicalAddress: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const orderSchema = new mongoose.Schema<IOrder>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [orderItemSchema],

    shippingAddress: [shippingAddressSchema],

    status: {
      type: String,
      enum: ["PROCESSING", "SHIPPED", "DELIVERED"],
      default: "PROCESSING",
    },
    authority: {
      type: String,
      unique: true,
      required: true,
    },
    totalCartPrice: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

const model = mongoose.model<IOrder>("Order", orderSchema);

export { model as orderModel };
