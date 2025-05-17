"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateAccessToken = async (id, role) => {
    try {
        const token = jsonwebtoken_1.default.sign({ id, role }, process.env.JWT_SECRET_ACCESS_TOKEN, {
            expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN_MINUTES),
        });
        return token;
    }
    catch (error) {
        throw error;
    }
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = async (id) => {
    try {
        const token = jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET_REFRESH_TOKEN, {
            expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRES_IN_SECOND),
        });
        return token;
    }
    catch (error) {
        throw error;
    }
};
exports.generateRefreshToken = generateRefreshToken;
const verifyToken = async (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_ACCESS_TOKEN);
    }
    catch (error) {
        throw error;
    }
};
exports.verifyToken = verifyToken;
