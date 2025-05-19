"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashData = hashData;
exports.compareData = compareData;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
function hashData(data) {
    try {
        return bcryptjs_1.default.hash(data, 12);
    }
    catch (error) {
        throw error;
    }
}
function compareData(data, hash) {
    try {
        return bcryptjs_1.default.compare(data, hash);
    }
    catch (error) {
        throw error;
    }
}
