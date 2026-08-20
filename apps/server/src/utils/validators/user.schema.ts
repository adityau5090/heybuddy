import { z } from "zod";

export const UpdateUserSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  image: z.string().url().optional(),
});

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
