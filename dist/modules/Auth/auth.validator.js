"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.verifyOtpSchema = exports.phoneSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
const addressSchema = zod_1.z.object({
    name: zod_1.z.string({ required_error: "نام آدرس الزامی است" }),
    postalCode: zod_1.z
        .number({ invalid_type_error: "کد پستی باید عدد باشد" })
        .refine((code) => code.toString().length === 10, {
        message: "کد پستی باید ۱۰ رقم باشد",
    }),
    physicalAddress: zod_1.z.string({ required_error: "آدرس فیزیکی الزامی است" }),
});
exports.createUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, { message: "نام باید حداقل ۲ کاراکتر باشد" }),
    email: zod_1.z.string().email({ message: "ایمیل وارد شده معتبر نیست" }).optional(),
    phone: zod_1.z
        .string()
        .min(11, { message: "شماره موبایل باید ۱۱ رقم باشد" })
        .max(11, { message: "شماره موبایل باید ۱۱ رقم باشد" }),
    password: zod_1.z
        .string()
        .min(6, { message: "رمز عبور باید حداقل ۶ کاراکتر باشد" })
        .optional(),
    addresses: zod_1.z
        .union([
        addressSchema,
        zod_1.z.array(addressSchema).min(1, { message: "حداقل یک آدرس لازم است" }),
    ])
        .transform((value) => (Array.isArray(value) ? value : [value])),
    favorites: zod_1.z
        .array(zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, {
        message: "شناسه محصول نامعتبر است",
    }))
        .optional(),
});
exports.phoneSchema = zod_1.z.object({
    phone: zod_1.z
        .string()
        .min(11, { message: "شماره موبایل باید ۱۱ رقم باشد" })
        .max(11, { message: "شماره موبایل باید ۱۱ رقم باشد" }),
});
exports.verifyOtpSchema = zod_1.z.object({
    phone: zod_1.z
        .string()
        .min(11, { message: "شماره موبایل باید ۱۱ رقم باشد" })
        .max(11, { message: "شماره موبایل باید ۱۱ رقم باشد" }),
    code: zod_1.z.string().length(5, { message: "کد یکبار مصرف باید 5 رقم باشد." }),
});
exports.loginSchema = zod_1.z.object({
    identifier: zod_1.z.string().refine((val) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{11}$/;
        return emailRegex.test(val) || phoneRegex.test(val);
    }, {
        message: "لطفا یک ایمیل یا شماره موبایل معتبر وارد کنید",
    }),
    password: zod_1.z.string().min(6, {
        message: "رمز عبور اختیاری است اما در صورت وارد کردن باید حداقل ۶ کاراکتر باشد",
    }),
});
