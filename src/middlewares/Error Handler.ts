import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("🧯 Error Handler Triggered");

  const status = err.status || 500;
  const defaultMessage = "خطای داخلی سرور";

  // Zod validation error
  if (err instanceof ZodError) {
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

  const errorMessage =
    typeof err?.message === "string" ? err.message : defaultMessage;

  console.log("🔥 Full Error Object:", err);

  res.status(status).json({ errorMessage });
  return;
};
