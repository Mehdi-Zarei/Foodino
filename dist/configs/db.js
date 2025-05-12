"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const connectToDatabase = async () => {
    try {
        await mongoose_1.default.connect(process.env.DB_URI);
        console.log(`✅ Connected to MongoDB successfully on : ${mongoose_1.default.connection.host}.`);
    }
    catch (error) {
        console.error("❌ Failed to connect to MongoDB:", error.message);
        process.exit(1);
    }
};
exports.default = connectToDatabase;
