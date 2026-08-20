import { z } from "zod";

export const JoinSessionSchema = z.object({
  role: z.enum(["GUEST", "HOST"]).optional(),
});

export const UpdateParticipantSchema = z.object({
  role: z.enum(["GUEST", "HOST"]),
});

export type JoinSessionInput = z.infer<typeof JoinSessionSchema>;
export type UpdateParticipantInput = z.infer<typeof UpdateParticipantSchema>;
