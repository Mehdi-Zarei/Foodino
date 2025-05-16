"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const sentSms = async (userPhone, smsPattern, smsVariable, data) => {
    try {
        const response = await axios_1.default.post("http://ippanel.com/api/select", {
            op: "pattern",
            user: process.env.OTP_USER,
            pass: process.env.OTP_PASS,
            fromNum: "3000505",
            toNum: userPhone,
            patternCode: smsPattern,
            inputData: [{ [smsVariable]: data }],
        });
        if (Array.isArray(response.data)) {
            console.log("SMS Error Body -->", response.data);
            return { success: false };
        }
        return { success: true };
    }
    catch (error) {
        console.error("SMS Error -->", error);
        return { success: false };
    }
};
exports.default = sentSms;
