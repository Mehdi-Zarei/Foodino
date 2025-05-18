import express, { Request, Response } from "express";
import path from "path";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static(path.join(__dirname, "..", "public")));

//* Files Routes
import productRouter from "./Products/product.routes";
import authRouter from "./Auth/auth.routes";
import userRouter from "./User/user.routes";
import cartRouter from "./Cart/cart.routes";
import { errorHandler } from "./Middlewares/Error Handler";

//* Routes
app.use("/product", productRouter);
app.use("/auth", authRouter);
app.use("/user/cart", cartRouter);
app.use("/user", userRouter);

//* 404 Error Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Oops!Page Not Found :(( " });
});

//* Global Error Handler
app.use(errorHandler);
export default app;
