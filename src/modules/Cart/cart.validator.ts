import { z } from "zod";

export const productQuantitySchema = z.object({
  quantity: z
    .number({ message: "لطفا عدد وارد کنید." })
    .min(1, { message: "مقدار محصول باید حداقل 1 عدد باشد." })
    .max(10, { message: "حداکثر مقدار مجاز 10 عدد می باشد." }),
});
