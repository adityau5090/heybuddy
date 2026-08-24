import { prisma } from "../lib/db.js";
import type { $Enums } from "../generated/prisma/client.js";

export const sessionParticipantRepository = {
  join(sessionID: string, userId: string, role?: $Enums.SessionRole) {
    return prisma.sessionParticipant.create({
      data: { sessionID, userId, ...(role ? { role } : {}) },
    });
  },

  leave(sessionID: string, userId: string) {
    return prisma.sessionParticipant.delete({
      where: { sessionID_userId: { sessionID, userId } },
    });
  },

  find(sessionID: string, userId: string) {
    return prisma.sessionParticipant.findUnique({
      where: { sessionID_userId: { sessionID, userId } },
    });
  },

  findBySession(sessionID: string) {
    return prisma.sessionParticipant.findMany({
      where: { sessionID },
      include: { user: { select: { id: true, email: true, name: true } } },
      orderBy: { joinedAt: "asc" },
    });
  },

  updateRole(sessionID: string, userId: string, role: $Enums.SessionRole) {
    return prisma.sessionParticipant.update({
      where: { sessionID_userId: { sessionID, userId } },
      data: { role },
    });
  },
};
