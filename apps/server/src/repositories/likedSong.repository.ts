import { prisma } from "../lib/db.js";

export const likedSongRepository = {
  like(userId: string, songId: string) {
    return prisma.likedSong.create({
      data: { userId, songId },
    });
  },

  unlike(userId: string, songId: string) {
    return prisma.likedSong.delete({
      where: { userId_songId: { userId, songId } },
    });
  },

  find(userId: string, songId: string) {
    return prisma.likedSong.findUnique({
      where: { userId_songId: { userId, songId } },
    });
  },

  findByUser(userId: string, skip: number, take: number) {
    return prisma.likedSong.findMany({
      where: { userId },
      skip,
      take,
      orderBy: { likedAt: "desc" },
      include: { song: true },
    });
  },

  countByUser(userId: string) {
    return prisma.likedSong.count({ where: { userId } });
  },
};
