import express, { Request, Response } from "express";
const app = express();
app.use(express.json());
app.use(express.urlencoded());

//* 404 Error Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Oops!Page Not Found :(( " });
});

export default app;
