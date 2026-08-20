import { z } from "zod";

export const CreateSessionMessageSchema = z.object({
  type: z.string().min(1).max(50),
  content: z.string().min(1).max(2000),
});

export type CreateSessionMessageInput = z.infer<
  typeof CreateSessionMessageSchema
>;
