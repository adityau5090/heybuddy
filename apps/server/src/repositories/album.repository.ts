import { prisma } from "../lib/db.js";
import type { Prisma } from "../generated/prisma/client.js";

export const albumRepository = {
  create(data: Prisma.AlbumCreateInput) {
    return prisma.album.create({ data });
  },

  findById(id: string) {
    return prisma.album.findUnique({
      where: { id },
      include: {
        song: { include: { song: true } },
        editors: true,
      },
    });
  },

  findMany(params: { skip: number; take: number; ownerId?: string }) {
    const { skip, take, ownerId } = params;
    return prisma.album.findMany({
      where: ownerId ? { ownerId } : {},
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });
  },

  count(ownerId?: string) {
    return prisma.album.count({ where: ownerId ? { ownerId } : {} });
  },

  update(id: string, data: Prisma.AlbumUpdateInput) {
    return prisma.album.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.album.delete({ where: { id } });
  },

  findEditor(albumId: string, userId: string) {
    return prisma.albumEditor.findUnique({
      where: { albumId_userId: { albumId, userId } },
    });
  },
};
