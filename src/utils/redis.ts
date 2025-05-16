import { redisClient as Redis } from "../configs/redis";

export const getOtpInfo = async (phone: string) => {
  try {
    const remainingTime = await Redis.ttl(`otp:${phone}`); // Time in seconds

    if (remainingTime <= 0) {
      return {
        remainingTime: 0,
        expired: true,
      };
    }

    const minutes = Math.floor(remainingTime / 60);

    const seconds = remainingTime % 60;

    const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;

    return {
      expired: false,
      remainingTime: formattedTime,
    };
  } catch (error) {
    throw error;
  }
};

export const saveData = async (
  key: string,
  value: number | string,
  ttl: number
) => {
  try {
    return await Redis.set(key, value, "EX", ttl);
  } catch (error) {
    throw error;
  }
};

export const getData = async (key: string) => {
  try {
    return await Redis.get(key);
  } catch (error) {
    throw error;
  }
};

export const removeData = async (key: string) => {
  try {
    return Redis.del(key);
  } catch (error) {
    throw error;
  }
};
