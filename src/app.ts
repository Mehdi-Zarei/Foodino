import express, { Request, Response } from "express";
import path from "path";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static(path.join(__dirname, "..", "public")));

//* Files Routes
import productRouter from "./Products/product.routes";

//* Routes
app.use("/product", productRouter);

//* 404 Error Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Oops!Page Not Found :(( " });
});

export default app;
