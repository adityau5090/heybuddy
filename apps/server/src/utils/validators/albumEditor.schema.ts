import { z } from "zod";

export const AddAlbumEditorSchema = z.object({
  userId: z.string().min(1),
});

export type AddAlbumEditorInput = z.infer<typeof AddAlbumEditorSchema>;
