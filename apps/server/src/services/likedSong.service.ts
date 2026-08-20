import { likedSongRepository } from "../repositories/likedSong.repository.js";
import { songRepository } from "../repositories/song.repository.js";
import { ApiError } from "../utils/ApiError.js";
import { getPagination, buildMeta, type PaginationQuery } from "../utils/pagination.js";

export const likedSongService = {
  async like(userId: string, songId: string) {
    const song = await songRepository.findById(songId);
    if (!song) throw ApiError.notFound("Song not found");

    const existing = await likedSongRepository.find(userId, songId);
    if (existing) throw ApiError.conflict("Song already liked");

    return likedSongRepository.like(userId, songId);
  },

  async unlike(userId: string, songId: string) {
    const existing = await likedSongRepository.find(userId, songId);
    if (!existing) throw ApiError.notFound("Liked song not found");

    await likedSongRepository.unlike(userId, songId);
  },

  async listForUser(userId: string, query: PaginationQuery) {
    const pagination = getPagination(query);
    const [items, total] = await Promise.all([
      likedSongRepository.findByUser(userId, pagination.skip, pagination.take),
      likedSongRepository.countByUser(userId),
    ]);
    return { items, meta: buildMeta(total, pagination) };
  },

  async isLiked(userId: string, songId: string) {
    const existing = await likedSongRepository.find(userId, songId);
    return Boolean(existing);
  },
};
