"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductSchema = exports.productSchema = void 0;
const zod_1 = require("zod");
const baseProductSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(3, { message: "نام محصول الزامی است و حداقل باید 3 کاراکتر باشد." }),
    price: zod_1.z.number().positive({ message: "قیمت باید عدد مثبت باشد" }),
    type: zod_1.z.enum(["Food", "Drink"], {
        message: "نوع محصول باید Food یا Drink باشد",
    }),
    description: zod_1.z
        .string()
        .max(500, { message: "توضیحات باید حداکثر 500 کاراکتر باشد" }),
    images: zod_1.z
        .array(zod_1.z.string().min(1, { message: "آدرس عکس نمی‌تواند خالی باشد" }))
        .min(1, { message: "حداقل یک عکس لازم است" }),
    isAvailable: zod_1.z.boolean(),
    ingredients: zod_1.z.array(zod_1.z.string().min(1, { message: "نام مواد اولیه نمی‌تواند خالی باشد" })),
});
const foodProductSchema = baseProductSchema.extend({
    type: zod_1.z.literal("Food"),
    weight: zod_1.z.number().positive({ message: "وزن باید عدد مثبت باشد" }),
    calories: zod_1.z
        .number()
        .nonnegative({ message: "کالری باید صفر یا عدد مثبت باشد" }),
});
const drinkProductSchema = baseProductSchema.extend({
    type: zod_1.z.literal("Drink"),
    volume: zod_1.z.number().positive({ message: "حجم باید عدد مثبت باشد" }),
    caffeineLevel: zod_1.z
        .number()
        .min(0, { message: "میزان کافئین نمی‌تواند منفی باشد" })
        .max(100, { message: "میزان کافئین باید بین 0 تا 100 باشد" }),
});
exports.productSchema = zod_1.z.discriminatedUnion("type", [
    foodProductSchema,
    drinkProductSchema,
]);
exports.updateProductSchema = zod_1.z.object({
    name: zod_1.z
        .string({ required_error: "نام محصول باید رشته باشد" })
        .min(1, { message: "نام محصول نمی‌تواند خالی باشد" })
        .optional(),
    price: zod_1.z.preprocess((val) => (typeof val === "string" ? Number(val) : val), zod_1.z
        .number({ invalid_type_error: "قیمت باید عدد باشد" })
        .positive({ message: "قیمت باید عددی مثبت باشد" })
        .optional()),
    type: zod_1.z.string({ invalid_type_error: "نوع محصول باید رشته باشد" }).optional(),
    description: zod_1.z
        .string({ invalid_type_error: "توضیحات باید رشته باشد" })
        .optional(),
    isAvailable: zod_1.z.preprocess((val) => {
        if (val === "true")
            return true;
        if (val === "false")
            return false;
        return val;
    }, zod_1.z.boolean({ invalid_type_error: "موجودی باید مقدار true یا false باشد" }).optional()),
    ingredients: zod_1.z
        .array(zod_1.z.string({ invalid_type_error: "مواد تشکیل‌دهنده باید رشته باشند" }))
        .optional(),
    calories: zod_1.z.preprocess((val) => (typeof val === "string" ? Number(val) : val), zod_1.z.number({ invalid_type_error: "کالری باید عدد باشد" }).optional()),
    weight: zod_1.z.preprocess((val) => (typeof val === "string" ? Number(val) : val), zod_1.z.number({ invalid_type_error: "وزن باید عدد باشد" }).optional()),
    volume: zod_1.z.preprocess((val) => (typeof val === "string" ? Number(val) : val), zod_1.z.number({ invalid_type_error: "حجم باید عدد باشد" }).optional()),
    caffeineLevel: zod_1.z.preprocess((val) => (typeof val === "string" ? Number(val) : val), zod_1.z.number({ invalid_type_error: "میزان کافئین باید عدد باشد" }).optional()),
});
