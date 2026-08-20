import { z } from "zod";

export const CreateListeningSessionSchema = z.object({
  currentSondId: z.string().min(1).optional(),
});

export const UpdateListeningSessionSchema = z.object({
  currentSondId: z.string().min(1).optional(),
  isPlaying: z.boolean().optional(),
  positionSeconds: z.number().min(0).optional(),
});

export type CreateListeningSessionInput = z.infer<
  typeof CreateListeningSessionSchema
>;
export type UpdateListeningSessionInput = z.infer<
  typeof UpdateListeningSessionSchema
>;
