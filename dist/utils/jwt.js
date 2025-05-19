"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function generateAccessToken(id, role) {
    try {
        const token = jsonwebtoken_1.default.sign({ id, role }, process.env.JWT_SECRET_ACCESS_TOKEN, {
            expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN_MINUTES),
        });
        return token;
    }
    catch (error) {
        throw error;
    }
}
function generateRefreshToken(id, role) {
    try {
        const token = jsonwebtoken_1.default.sign({ id, role }, process.env.JWT_SECRET_REFRESH_TOKEN, {
            expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRES_IN_SECOND),
        });
        return token;
    }
    catch (error) {
        throw error;
    }
}
function verifyToken(token, secret) {
    try {
        return jsonwebtoken_1.default.verify(token, secret);
    }
    catch (error) {
        throw error;
    }
}
