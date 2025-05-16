"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = exports.verifyOtp = exports.sentOtp = void 0;
const User_1 = __importDefault(require("../models/User"));
const redis_1 = require("../utils/redis");
const sentSms_1 = __importDefault(require("../Service/sentSms"));
const jwt_1 = require("../utils/jwt");
const bcryptjs_1 = require("../utils/bcryptjs");
const sentOtp = async (req, res, next) => {
    try {
        const { phone } = req.body;
        const isUserRestrict = await User_1.default.findOne({ phone, isRestrict: true });
        if (isUserRestrict) {
            res
                .status(403)
                .json({ message: "حساب کاربری شما به علت تخلف مسدود شده است." });
            return;
        }
        const { remainingTime, expired } = await (0, redis_1.getOtpInfo)(phone);
        if (!expired) {
            res.status(403).json({
                message: `کد یکبارمصرف قبلا برای شما ارسال گردیده است.لطفا پس از ${remainingTime} مجدد تلاش کنید.`,
            });
            return;
        }
        const generateOtpCode = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
        await (0, redis_1.saveData)(`otp:${phone}`, generateOtpCode, 60);
        const smsResult = await (0, sentSms_1.default)(phone, process.env.OTP_PATTERN, process.env.OTP_VARIABLE, generateOtpCode);
        if (smsResult.success) {
            res.status(200).json({
                message: "کد یکبار مصرف با موفقیت ارسال گردید.",
                data: generateOtpCode,
            });
            return;
        }
        else {
            res.status(500).json({
                message: "خطا در ارسال کد یکبار مصرف،لطفا مجدد تلاش فرمائید.",
            });
            return;
        }
    }
    catch (error) {
        next(error);
    }
};
exports.sentOtp = sentOtp;
const verifyOtp = async (req, res, next) => {
    try {
        const { code, phone } = req.body;
        const storedOtp = await (0, redis_1.getData)(`otp:${phone}`);
        if (!storedOtp || storedOtp !== code) {
            res.status(403).json({
                message: "کد وارد شده صحیح نمی باشد و یا مدت زمان آن به پایان رسیده است.",
            });
            return;
        }
        const isUserExist = await User_1.default.findOne({ phone });
        if (isUserExist) {
            const accessToken = await (0, jwt_1.generateAccessToken)(isUserExist._id, isUserExist.role);
            const refreshToken = await (0, jwt_1.generateRefreshToken)(isUserExist._id);
            const hashRefreshToken = await (0, bcryptjs_1.hashData)(refreshToken);
            await (0, redis_1.saveData)(`refreshToken:${isUserExist._id}`, hashRefreshToken, parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS));
            res.status(200).json({
                message: "با موفقیت وارد حساب کاربری خود شدید",
                data: { accessToken, refreshToken },
            });
            await (0, redis_1.removeData)(`otp:${phone}`);
            return;
        }
        res.status(200).json({ message: "Redirect To Register Page." });
        return;
    }
    catch (error) {
        next(error);
    }
};
exports.verifyOtp = verifyOtp;
const register = async (req, res, next) => {
    try {
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const logout = async (req, res, next) => {
    try {
    }
    catch (error) {
        next(error);
    }
};
exports.logout = logout;
