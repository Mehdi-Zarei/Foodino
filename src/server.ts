import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { Express } from "express";
import connectToDatabase from "./Configs/db";
import { connectRedis } from "./Configs/redis";

const startServer = async (app: Express, port: number) => {
  try {
    connectToDatabase();
    connectRedis();
    app.listen(port, () => {
      console.log(`🚀 Server is up and running at: ${port}`);
    });
  } catch (error: any) {
    console.error("❌ Failed to start the server:", error.message);
    process.exit(1);
  }
};

startServer(app, Number(process.env.SERVER_PORT || 4000));
