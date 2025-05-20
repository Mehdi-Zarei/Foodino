import { z } from "zod";

const baseProductSchema = z.object({
  name: z
    .string()
    .min(3, { message: "نام محصول الزامی است و حداقل باید 3 کاراکتر باشد." }),
  price: z.number().positive({ message: "قیمت باید عدد مثبت باشد" }),
  type: z.enum(["Food", "Drink"], {
    message: "نوع محصول باید Food یا Drink باشد",
  }),
  description: z
    .string()
    .max(500, { message: "توضیحات باید حداکثر 500 کاراکتر باشد" }),
  images: z
    .array(z.string().min(1, { message: "آدرس عکس نمی‌تواند خالی باشد" }))
    .min(1, { message: "حداقل یک عکس لازم است" }),

  isAvailable: z.boolean(),
  ingredients: z.array(
    z.string().min(1, { message: "نام مواد اولیه نمی‌تواند خالی باشد" })
  ),
});

const foodProductSchema = baseProductSchema.extend({
  type: z.literal("Food"),
  weight: z.number().positive({ message: "وزن باید عدد مثبت باشد" }),
  calories: z
    .number()
    .nonnegative({ message: "کالری باید صفر یا عدد مثبت باشد" }),
});

const drinkProductSchema = baseProductSchema.extend({
  type: z.literal("Drink"),
  volume: z.number().positive({ message: "حجم باید عدد مثبت باشد" }),
  caffeineLevel: z
    .number()
    .min(0, { message: "میزان کافئین نمی‌تواند منفی باشد" })
    .max(100, { message: "میزان کافئین باید بین 0 تا 100 باشد" }),
});

export const productSchema = z.discriminatedUnion("type", [
  foodProductSchema,
  drinkProductSchema,
]);

export const updateProductSchema = z.object({
  name: z
    .string({ required_error: "نام محصول باید رشته باشد" })
    .min(1, { message: "نام محصول نمی‌تواند خالی باشد" })
    .optional(),
  price: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z
      .number({ invalid_type_error: "قیمت باید عدد باشد" })
      .positive({ message: "قیمت باید عددی مثبت باشد" })
      .optional()
  ),
  type: z.string({ invalid_type_error: "نوع محصول باید رشته باشد" }).optional(),
  description: z
    .string({ invalid_type_error: "توضیحات باید رشته باشد" })
    .optional(),
  isAvailable: z.preprocess((val) => {
    if (val === "true") return true;
    if (val === "false") return false;
    return val;
  }, z.boolean({ invalid_type_error: "موجودی باید مقدار true یا false باشد" }).optional()),
  ingredients: z
    .array(z.string({ invalid_type_error: "مواد تشکیل‌دهنده باید رشته باشند" }))
    .optional(),
  calories: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z.number({ invalid_type_error: "کالری باید عدد باشد" }).optional()
  ),
  weight: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z.number({ invalid_type_error: "وزن باید عدد باشد" }).optional()
  ),
  volume: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z.number({ invalid_type_error: "حجم باید عدد باشد" }).optional()
  ),
  caffeineLevel: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z.number({ invalid_type_error: "میزان کافئین باید عدد باشد" }).optional()
  ),
});
