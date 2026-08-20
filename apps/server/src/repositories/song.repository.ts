import { prisma } from "../lib/db.js";
import type { Prisma } from "../generated/prisma/client.js";

export const songRepository = {
  create(data: Prisma.SongCreateInput) {
    return prisma.song.create({ data });
  },

  findById(id: string) {
    return prisma.song.findUnique({ where: { id } });
  },

  findMany(params: {
    skip: number;
    take: number;
    search?: string;
  }) {
    const { skip, take, search } = params;
    const where: Prisma.SongWhereInput = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { artist: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    return prisma.song.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });
  },

  count(search?: string) {
    const where: Prisma.SongWhereInput = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { artist: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};
    return prisma.song.count({ where });
  },

  update(id: string, data: Prisma.SongUpdateInput) {
    return prisma.song.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.song.delete({ where: { id } });
  },
};
