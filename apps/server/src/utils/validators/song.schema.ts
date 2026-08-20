import { z } from "zod";

export const CreateSongSchema = z.object({
  title: z.string().min(1).max(200),
  artist: z.string().min(1).max(200),
  coverUrl: z.string().url().optional(),
  audioUrl: z.string().url(),
  duration: z.number().int().positive(),
});

export const UpdateSongSchema = CreateSongSchema.partial();

export type CreateSongInput = z.infer<typeof CreateSongSchema>;
export type UpdateSongInput = z.infer<typeof UpdateSongSchema>;
