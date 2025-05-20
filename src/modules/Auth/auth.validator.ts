import { z } from "zod";

const addressSchema = z.object({
  name: z.string({ required_error: "نام آدرس الزامی است" }),
  postalCode: z
    .number({ invalid_type_error: "کد پستی باید عدد باشد" })
    .refine((code) => code.toString().length === 10, {
      message: "کد پستی باید ۱۰ رقم باشد",
    }),
  physicalAddress: z.string({ required_error: "آدرس فیزیکی الزامی است" }),
});

export const createUserSchema = z.object({
  name: z.string().min(2, { message: "نام باید حداقل ۲ کاراکتر باشد" }),
  email: z.string().email({ message: "ایمیل وارد شده معتبر نیست" }).optional(),
  phone: z
    .string()
    .min(11, { message: "شماره موبایل باید ۱۱ رقم باشد" })
    .max(11, { message: "شماره موبایل باید ۱۱ رقم باشد" }),
  password: z
    .string()
    .min(6, { message: "رمز عبور باید حداقل ۶ کاراکتر باشد" })
    .optional(),

  addresses: z
    .union([
      addressSchema,
      z.array(addressSchema).min(1, { message: "حداقل یک آدرس لازم است" }),
    ])
    .transform((value) => (Array.isArray(value) ? value : [value])),

  favorites: z
    .array(
      z.string().regex(/^[0-9a-fA-F]{24}$/, {
        message: "شناسه محصول نامعتبر است",
      })
    )
    .optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const phoneSchema = z.object({
  phone: z
    .string()
    .min(11, { message: "شماره موبایل باید ۱۱ رقم باشد" })
    .max(11, { message: "شماره موبایل باید ۱۱ رقم باشد" }),
});

export const verifyOtpSchema = z.object({
  phone: z
    .string()
    .min(11, { message: "شماره موبایل باید ۱۱ رقم باشد" })
    .max(11, { message: "شماره موبایل باید ۱۱ رقم باشد" }),

  code: z.string().length(5, { message: "کد یکبار مصرف باید 5 رقم باشد." }),
});

export const loginSchema = z.object({
  identifier: z.string().refine(
    (val) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\d{11}$/;
      return emailRegex.test(val) || phoneRegex.test(val);
    },
    {
      message: "لطفا یک ایمیل یا شماره موبایل معتبر وارد کنید",
    }
  ),
  password: z.string().min(6, {
    message:
      "رمز عبور اختیاری است اما در صورت وارد کردن باید حداقل ۶ کاراکتر باشد",
  }),
});
