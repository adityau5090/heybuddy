import { userRepository } from "../repositories/user.repository.js";
import { ApiError } from "../utils/ApiError.js";
import { getPagination, buildMeta, type PaginationQuery } from "../utils/pagination.js";
import type { UpdateUserInput } from "../utils/validators/user.schema.js";

export const userService = {
  async getById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) throw ApiError.notFound("User not found");
    return user;
  },

  async list(query: PaginationQuery & { search?: string }) {
    const pagination = getPagination(query);
    const [items, total] = await Promise.all([
      userRepository.findMany({
        ...pagination,
        ...(query.search !== undefined ? { search: query.search } : {}),
      }),
      userRepository.count(query.search),
    ]);
    return { items, meta: buildMeta(total, pagination) };
  },

  /** A user may only update their own profile. */
  async updateProfile(id: string, requesterId: string, input: UpdateUserInput) {
    if (id !== requesterId) {
      throw ApiError.forbidden("You can only update your own profile");
    }
    await this.getById(id);
    return userRepository.update(id, {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.image !== undefined ? { image: input.image } : {}),
    });
  },

  async remove(id: string, requesterId: string) {
    if (id !== requesterId) {
      throw ApiError.forbidden("You can only delete your own account");
    }
    await this.getById(id);
    await userRepository.delete(id);
  },
};
