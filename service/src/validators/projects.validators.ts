import { z } from "zod";

export const AddProjectRequestValidator = z.object({
  name: z.string().min(3).max(255),
  description: z.string().min(32).max(255),
});
