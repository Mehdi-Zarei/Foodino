import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("🧯 Error Handler Triggered");

  const status = err.status || 500;
  const defaultMessage = "خطای داخلی سرور";

  // Joi validation error
  if (err.isJoi) {
    const validationErrors = err.details.map((detail: any) => ({
      field: detail.context?.key || "نامشخص",
      message: detail.message,
    }));

    console.log("📦 Joi Validation Error:", validationErrors);

    res
      .status(409)
      .json({ msg: "خطا در اعتبارسنجی اطلاعات", validationErrors });
    return;
  }

  const errorMessage =
    typeof err?.message === "string" ? err.message : defaultMessage;

  console.log("🔥 Full Error Object:", err);

  res.status(status).json({ errorMessage });
  return;
};
