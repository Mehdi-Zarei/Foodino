"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    console.log("🧯 Error Handler Triggered");
    const status = err.status || 500;
    const defaultMessage = "خطای داخلی سرور";
    // Joi validation error
    if (err.isJoi) {
        const validationErrors = err.details.map((detail) => ({
            field: detail.context?.key || "نامشخص",
            message: detail.message,
        }));
        console.log("📦 Joi Validation Error:", validationErrors);
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
