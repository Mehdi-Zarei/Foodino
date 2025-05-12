import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.DB_URI!);
    console.log(
      `✅ Connected to MongoDB successfully on : ${mongoose.connection.host}.`
    );
  } catch (error: any) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectToDatabase;
