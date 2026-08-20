import { prisma } from "../lib/db.js";
import type { Prisma } from "../generated/prisma/client.js";

export const userRepository = {
  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  findMany(params: { skip: number; take: number; search?: string }) {
    const { skip, take, search } = params;
    const where: Prisma.UserWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    return prisma.user.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });
  },

  count(search?: string) {
    const where: Prisma.UserWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};
    return prisma.user.count({ where });
  },

  update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.user.delete({ where: { id } });
  },
};
