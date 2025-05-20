// src/schemas/userSchema.ts
import { z } from "zod";

export const updateUserSchema = z.object({
  name: z
    .string({ required_error: "نام باید رشته باشد" })
    .min(2, { message: "نام باید حداقل ۲ کاراکتر باشد" })
    .optional(),

  email: z
    .string({ required_error: "ایمیل باید رشته باشد" })
    .email({ message: "ایمیل وارد شده معتبر نیست" })
    .optional(),

  password: z
    .string({ required_error: "رمز عبور باید رشته باشد" })
    .min(6, { message: "رمز عبور باید حداقل ۶ کاراکتر باشد" })
    .optional(),

  addresses: z
    .array(
      z.object({
        name: z
          .string({ required_error: "عنوان آدرس باید رشته باشد" })
          .min(1, { message: "عنوان آدرس نمی‌تواند خالی باشد" }),

        postalCode: z
          .number({ invalid_type_error: "کد پستی باید عدد باشد" })
          .min(1000000000, { message: "کد پستی باید ۱۰ رقمی باشد" }),

        physicalAddress: z
          .string({ required_error: "آدرس فیزیکی باید رشته باشد" })
          .min(5, { message: "آدرس فیزیکی باید حداقل ۵ کاراکتر باشد" }),
      })
    )
    .optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
