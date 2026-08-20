import { prisma } from "../lib/db.js";
import type { Prisma } from "../generated/prisma/client.js";

function generateJoinCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export const listeningSessionRepository = {
  create(
    hostId: string,
    data: Omit<Prisma.ListeningSessionCreateWithoutHostInput, "joinCode">,
  ) {
    return prisma.listeningSession.create({
      data: {
        ...data,
        joinCode: generateJoinCode(),
        host: { connect: { id: hostId } },
      },
    });
  },

  findById(id: string) {
    return prisma.listeningSession.findUnique({
      where: { id },
      include: {
        currentSong: true,
        participants: true,
        queue: { orderBy: { position: "asc" } },
      },
    });
  },

  findByJoinCode(joinCode: string) {
    return prisma.listeningSession.findUnique({ where: { joinCode } });
  },

  findMany(params: { skip: number; take: number; hostId?: string }) {
    const { skip, take, hostId } = params;
    return prisma.listeningSession.findMany({
      where: hostId ? { hostId } : {},
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });
  },

  count(hostId?: string) {
    return prisma.listeningSession.count({ where: hostId ? { hostId } : {} });
  },

  update(id: string, data: Prisma.ListeningSessionUpdateInput) {
    return prisma.listeningSession.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.listeningSession.delete({ where: { id } });
  },
};
