import express, { Request, Response } from "express";
const app = express();
app.use(express.json());
app.use(express.urlencoded());

import multer from "multer"; //TODO
app.use(multer().none());

//* Files Routes
import productRouter from "./Products/product.routes";

//* Routes
app.use("/product", productRouter);

//* 404 Error Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Oops!Page Not Found :(( " });
});

export default app;
