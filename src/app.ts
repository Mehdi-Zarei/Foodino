import express, { Request, Response } from "express";
const app = express();
import path from "path";
import cookieParser from "cookie-parser";
import { errorHandler } from "./Middlewares/Error Handler";

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static(path.join(__dirname, "..", "public")));
app.use(cookieParser());

//* Files Routes
import productRouter from "./modules/Products/product.routes";
import authRouter from "./modules/Auth/auth.routes";
import userRouter from "./modules/User/user.routes";
import cartRouter from "./modules/Cart/cart.routes";
import checkoutRouter from "./modules/Checkout/checkout.routes";
import orderRouter from "./modules/Order/order.routes";

//* Routes
app.use("/api/product", productRouter);
app.use("/api/auth", authRouter);
app.use("/api/user/cart", cartRouter);
app.use("/api/user", userRouter);
app.use("/api/checkouts", checkoutRouter);
app.use("/api/orders", orderRouter);

//* 404 Error Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Oops!Page Not Found :(( " });
});

//* Global Error Handler
app.use(errorHandler);
export default app;
