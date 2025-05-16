"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeData = exports.getData = exports.saveData = exports.getOtpInfo = void 0;
const redis_1 = require("../configs/redis");
const getOtpInfo = async (phone) => {
    try {
        const remainingTime = await redis_1.redisClient.ttl(`otp:${phone}`); // Time in seconds
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
    }
    catch (error) {
        throw error;
    }
};
exports.getOtpInfo = getOtpInfo;
const saveData = async (key, value, ttl) => {
    try {
        return await redis_1.redisClient.set(key, value, "EX", ttl);
    }
    catch (error) {
        throw error;
    }
};
exports.saveData = saveData;
const getData = async (key) => {
    try {
        return await redis_1.redisClient.get(key);
    }
    catch (error) {
        throw error;
    }
};
exports.getData = getData;
const removeData = async (key) => {
    try {
        return redis_1.redisClient.del(key);
    }
    catch (error) {
        throw error;
    }
};
exports.removeData = removeData;
