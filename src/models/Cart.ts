import mongoose, { Types } from "mongoose";

interface ICartItems {
  product: Types.ObjectId;
  quantity: number;
  priceAtTimeOfPurchase: number;
}

interface ICart {
  user: Types.ObjectId;
  items: ICartItems[];
  totalCartPrice: number;
}

const cartItemsSchema = new mongoose.Schema<ICartItems>(
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

const cartSchema = new mongoose.Schema<ICart>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [cartItemsSchema],
    totalCartPrice: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true }
);

cartSchema.pre("save", function (next) {
  this.totalCartPrice = this.items.reduce((total, item) => {
    return total + item.priceAtTimeOfPurchase * item.quantity;
  }, 0);
  next();
});

const model = mongoose.model<ICart>("Cart", cartSchema);

export { model as cartModel, ICart };
