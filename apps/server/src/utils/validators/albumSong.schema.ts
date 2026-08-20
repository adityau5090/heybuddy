import { z } from "zod";

export const AddSongToAlbumSchema = z.object({
  songId: z.string().min(1),
});

export type AddSongToAlbumInput = z.infer<typeof AddSongToAlbumSchema>;
