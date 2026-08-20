import { songRepository } from "../repositories/song.repository.js";
import { ApiError } from "../utils/ApiError.js";
import { getPagination, buildMeta, type PaginationQuery } from "../utils/pagination.js";
import type { CreateSongInput, UpdateSongInput } from "../utils/validators/song.schema.js";

export const songService = {
  async create(input: CreateSongInput) {
    return songRepository.create({ ...input, coverUrl: input.coverUrl ?? null });
  },

  async getById(id: string) {
    const song = await songRepository.findById(id);
    if (!song) throw ApiError.notFound("Song not found");
    return song;
  },

  async list(query: PaginationQuery & { search?: string }) {
    const pagination = getPagination(query);
    const [items, total] = await Promise.all([
      songRepository.findMany({
        ...pagination,
        ...(query.search !== undefined ? { search: query.search } : {}),
      }),
      songRepository.count(query.search),
    ]);
    return { items, meta: buildMeta(total, pagination) };
  },

  async update(id: string, input: UpdateSongInput) {
    await this.getById(id);
    const updateData = Object.fromEntries(
      Object.entries(input).filter(([, value]) => value !== undefined),
    );
    return songRepository.update(id, updateData);
  },

  async remove(id: string) {
    await this.getById(id);
    await songRepository.delete(id);
  },
};
