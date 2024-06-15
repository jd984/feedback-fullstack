import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username must be at least 2 characters")
  .max(15, "Username must be no more than 15 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters");

export const signUpSchemaValidation = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Invalid email address" }),
});
