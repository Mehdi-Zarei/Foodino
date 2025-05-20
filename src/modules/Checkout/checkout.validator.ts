import { z } from "zod";

export const checkoutQuerySchema = z.object({
  Status: z.enum(["OK", "NOK"]),
  Authority: z.string(),
});
