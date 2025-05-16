"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedis = exports.redisClient = void 0;
const ioredis_1 = require("ioredis");
const redisClient = new ioredis_1.Redis(process.env.REDIS_URI);
exports.redisClient = redisClient;
const connectRedis = async () => {
    try {
        await redisClient.ping();
        console.log("✅ Connected to Redis Successfully.");
    }
    catch (error) {
        console.error("❌ Redis connection error:", error);
        redisClient.quit();
        process.exit(1);
    }
};
exports.connectRedis = connectRedis;
redisClient.on("error", (error) => {
    console.error("❌ Redis error:", error);
    setTimeout(() => {
        redisClient
            .connect()
            .catch((err) => console.error("❌ Retry failed:", err));
    }, 5000);
});
