import mongoose, { Types } from "mongoose";

interface ICheckoutItems {
  product: Types.ObjectId;
  quantity: number;
  priceAtTimeOfPurchase: number;
}

interface IShippingAddress {
  name: string;
  postalCode: number;
  physicalAddress: string;
}

interface ICheckout {
  user: Types.ObjectId;
  items: ICheckoutItems[];
  shippingAddress: string[];
  authority: string;
  totalCartPrice: number;
  expiresAt: Date;
}
const checkoutItemsSchema = new mongoose.Schema<ICheckoutItems>(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
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

const checkoutSchema = new mongoose.Schema<ICheckout>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [checkoutItemsSchema],
    shippingAddress: [shippingAddressSchema],
    authority: {
      type: String,
      required: true,
    },
    totalCartPrice: {
      type: Number,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => Date.now() + 60 * 60 * 1000,
    },
  },

  { timestamps: true }
);

//* TTL
checkoutSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const model = mongoose.model<ICheckout>("Checkout", checkoutSchema);

export { model as checkoutModel };
