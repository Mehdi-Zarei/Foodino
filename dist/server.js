"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./configs/db"));
const startServer = async (app, port) => {
    try {
        (0, db_1.default)();
        app.listen(port, () => {
            console.log(`🚀 Server is up and running at: ${port}`);
        });
    }
    catch (error) {
        console.error("❌ Failed to start the server:", error.message);
        process.exit(1);
    }
};
startServer(app_1.default, Number(process.env.SERVER_PORT || 4000));
