import { prisma } from "../lib/db.js";

export const albumEditorRepository = {
  add(albumId: string, userId: string) {
    return prisma.albumEditor.create({
      data: { albumId, userId },
    });
  },

  remove(albumId: string, userId: string) {
    return prisma.albumEditor.delete({
      where: { albumId_userId: { albumId, userId } },
    });
  },

  find(albumId: string, userId: string) {
    return prisma.albumEditor.findUnique({
      where: { albumId_userId: { albumId, userId } },
    });
  },

  findByAlbum(albumId: string) {
    return prisma.albumEditor.findMany({
      where: { albumId },
    });
  },
};
