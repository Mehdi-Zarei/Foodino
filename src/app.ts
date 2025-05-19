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
import productRouter from "./Products/product.routes";
import authRouter from "./Auth/auth.routes";
import userRouter from "./User/user.routes";
import cartRouter from "./Cart/cart.routes";
import checkoutRouter from "./Checkout/checkout.routes";

//* Routes
app.use("/api/product", productRouter);
app.use("/api/auth", authRouter);
app.use("/api/user/cart", cartRouter);
app.use("/api/user", userRouter);
app.use("/api/checkouts", checkoutRouter);

//* 404 Error Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Oops!Page Not Found :(( " });
});

//* Global Error Handler
app.use(errorHandler);
export default app;
