import { z } from "zod";

export const acceptMessageSchemaValidation = z.object({
  acceptMessage: z.boolean(),
});
