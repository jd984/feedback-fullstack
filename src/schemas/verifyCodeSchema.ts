import { z } from "zod";

export const verifyCodeValidation = z
  .string()
  .length(6, "Verification code must be exactly 6 digits")
  .regex(/^\d{6}$/, "Verification code must only contain digits");
