import { prisma } from "../lib/db.js";

export const albumSongRepository = {
  add(albumId: string, songId: string) {
    return prisma.albumSong.create({
      data: { albumId, songId },
    });
  },

  remove(albumId: string, songId: string) {
    return prisma.albumSong.delete({
      where: { albumId_songId: { albumId, songId } },
    });
  },

  find(albumId: string, songId: string) {
    return prisma.albumSong.findUnique({
      where: { albumId_songId: { albumId, songId } },
    });
  },

  findByAlbum(albumId: string, skip: number, take: number) {
    return prisma.albumSong.findMany({
      where: { albumId },
      skip,
      take,
      orderBy: { addedAt: "desc" },
      include: { song: true },
    });
  },

  countByAlbum(albumId: string) {
    return prisma.albumSong.count({ where: { albumId } });
  },
};
