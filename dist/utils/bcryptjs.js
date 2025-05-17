"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareData = exports.hashData = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const hashData = async (data) => {
    try {
        return bcryptjs_1.default.hash(data, 15);
    }
    catch (error) {
        throw error;
    }
};
exports.hashData = hashData;
const compareData = async (data, hash) => {
    try {
        return bcryptjs_1.default.compare(data, hash);
    }
    catch (error) {
        throw error;
    }
};
exports.compareData = compareData;
