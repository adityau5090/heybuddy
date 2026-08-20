import { z } from "zod";

export const AddQueueItemSchema = z.object({
  songId: z.string().min(1),
  position: z.number().int().min(0).optional(),
});

export const UpdateQueueItemSchema = z.object({
  position: z.number().int().min(0),
});

export type AddQueueItemInput = z.infer<typeof AddQueueItemSchema>;
export type UpdateQueueItemInput = z.infer<typeof UpdateQueueItemSchema>;
