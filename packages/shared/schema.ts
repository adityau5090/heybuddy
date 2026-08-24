import {string, z} from "zod"

export const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8,"Min password should be of length 8"),
    name: z.string().min(1),
})

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
})

export const CreateAlbumSchema = z.object({
  name: z.string().min(1).max(60),
  isCollaborative: z.boolean().optional(),
});

export const CreateSessionSchema = z.object({
  songId: z.string().cuid(),
});

export const JoinSessionSchema = z.object({
  joinCode: z.string().length(6),
});

export const QueueAddSchema = z.object({
  sessionId: z.string().cuid(),
  songId: z.string().cuid(),
});

export const SendMessageSchema = z.object({
  sessionId: z.string().cuid(),
  type: z.enum(["text", "emoji"]),
  content: z.string().min(1).max(500),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type CreateAlbumInput = z.infer<typeof CreateAlbumSchema>;