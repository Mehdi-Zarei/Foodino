"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const errorHandler = (err, req, res, next) => {
    console.log("🧯 Error Handler Triggered");
    const status = err.status || 500;
    const defaultMessage = "خطای داخلی سرور";
    // Zod validation error
    if (err instanceof zod_1.ZodError) {
        const validationErrors = err.errors.map((detail) => ({
            field: detail.path.join(".") || "نامشخص",
            message: detail.message,
        }));
        console.log("📦 Zod Validation Error:", validationErrors);
        res
            .status(409)
            .json({ msg: "خطا در اعتبارسنجی اطلاعات", validationErrors });
        return;
    }
    const errorMessage = typeof err?.message === "string" ? err.message : defaultMessage;
    console.log("🔥 Full Error Object:", err);
    res.status(status).json({ errorMessage });
    return;
};
exports.errorHandler = errorHandler;
