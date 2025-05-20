"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = void 0;
// src/schemas/userSchema.ts
const zod_1 = require("zod");
exports.updateUserSchema = zod_1.z.object({
    name: zod_1.z
        .string({ required_error: "نام باید رشته باشد" })
        .min(2, { message: "نام باید حداقل ۲ کاراکتر باشد" })
        .optional(),
    email: zod_1.z
        .string({ required_error: "ایمیل باید رشته باشد" })
        .email({ message: "ایمیل وارد شده معتبر نیست" })
        .optional(),
    password: zod_1.z
        .string({ required_error: "رمز عبور باید رشته باشد" })
        .min(6, { message: "رمز عبور باید حداقل ۶ کاراکتر باشد" })
        .optional(),
    addresses: zod_1.z
        .array(zod_1.z.object({
        name: zod_1.z
            .string({ required_error: "عنوان آدرس باید رشته باشد" })
            .min(1, { message: "عنوان آدرس نمی‌تواند خالی باشد" }),
        postalCode: zod_1.z
            .number({ invalid_type_error: "کد پستی باید عدد باشد" })
            .min(1000000000, { message: "کد پستی باید ۱۰ رقمی باشد" }),
        physicalAddress: zod_1.z
            .string({ required_error: "آدرس فیزیکی باید رشته باشد" })
            .min(5, { message: "آدرس فیزیکی باید حداقل ۵ کاراکتر باشد" }),
    }))
        .optional(),
});
