import { Redis } from "ioredis";

const redisClient = new Redis(process.env.REDIS_URI!);

const connectRedis = async () => {
  try {
    await redisClient.ping();
    console.log("✅ Connected to Redis Successfully.");
  } catch (error) {
    console.error("❌ Redis connection error:", error);
    redisClient.quit();
    process.exit(1);
  }
};

redisClient.on("error", (error) => {
  console.error("❌ Redis error:", error);
  setTimeout(() => {
    redisClient
      .connect()
      .catch((err) => console.error("❌ Retry failed:", err));
  }, 5000);
});

export { redisClient, connectRedis };
