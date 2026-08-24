import { prisma } from "../lib/db.js";

export const sessionMessageRepository = {
  create(sessionId: string, userId: string, type: string, content: string) {
    return prisma.sessionMessage.create({
      data: { sessionId, userId, type, content },
    });
  },

  findById(id: string) {
    return prisma.sessionMessage.findUnique({ where: { id } });
  },

  findBySession(sessionId: string, skip: number, take: number) {
    return prisma.sessionMessage.findMany({
      where: { sessionId },
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { id: true, name: true, image: true } } },
    });
  },

  countBySession(sessionId: string) {
    return prisma.sessionMessage.count({ where: { sessionId } });
  },

  delete(id: string) {
    return prisma.sessionMessage.delete({ where: { id } });
  },
};
