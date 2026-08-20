import { z } from "zod";

export const CreateAlbumSchema = z.object({
  name: z.string().min(1).max(200),
  isCollaborative: z.boolean().optional(),
});

export const UpdateAlbumSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  isCollaborative: z.boolean().optional(),
});

export type CreateAlbumInput = z.infer<typeof CreateAlbumSchema>;
export type UpdateAlbumInput = z.infer<typeof UpdateAlbumSchema>;
