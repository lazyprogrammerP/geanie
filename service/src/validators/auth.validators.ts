import { z } from "zod";

export const SignUpRequestValidator = z.object({
  name: z.string().min(3).max(255),
  email: z.string().email(),
  password: z.string().min(8).max(255),
});

export const SignInRequestValidator = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(255),
});
