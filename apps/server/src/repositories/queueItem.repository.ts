import { prisma } from "../lib/db.js";

export const queueItemRepository = {
  async add(sessionId: string, songId: string, addedById: string, position?: number) {
    let nextPosition = position;
    if (nextPosition === undefined) {
      const last = await prisma.queueItem.findFirst({
        where: { sessionId },
        orderBy: { position: "desc" },
      });
      nextPosition = last ? last.position + 1 : 0;
    }

    return prisma.queueItem.create({
      data: { sessionId, songId, addedById, position: nextPosition },
    });
  },

  findById(id: string) {
    return prisma.queueItem.findUnique({ where: { id }, include: { song: true } });
  },

  findBySession(sessionId: string) {
    return prisma.queueItem.findMany({
      where: { sessionId },
      orderBy: { position: "asc" },
      include: { song: true },
    });
  },

  updatePosition(id: string, position: number) {
    return prisma.queueItem.update({ where: { id }, data: { position } });
  },

  delete(id: string) {
    return prisma.queueItem.delete({ where: { id } });
  },
};
