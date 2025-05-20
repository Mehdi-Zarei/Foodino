import { z } from "zod";

export const statusSchema = z.object({
  status: z.enum(["PROCESSING", "SHIPPED", "DELIVERED"], {
    message: `وضعیت باید یکی از مقادیر مجاز("PROCESSING", "SHIPPED", "DELIVERED") باشد.`,
  }),
});
