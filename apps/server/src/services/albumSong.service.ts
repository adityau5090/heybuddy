import { albumSongRepository } from "../repositories/albumSong.repository.js";
import { songRepository } from "../repositories/song.repository.js";
import { albumService } from "./album.service.js";
import { ApiError } from "../utils/ApiError.js";
import { getPagination, buildMeta, type PaginationQuery } from "../utils/pagination.js";

export const albumSongService = {
  async addSong(albumId: string, userId: string, songId: string) {
    await albumService.assertCanEdit(albumId, userId);

    const song = await songRepository.findById(songId);
    if (!song) throw ApiError.notFound("Song not found");

    const existing = await albumSongRepository.find(albumId, songId);
    if (existing) throw ApiError.conflict("Song already in album");

    return albumSongRepository.add(albumId, songId);
  },

  async removeSong(albumId: string, userId: string, songId: string) {
    await albumService.assertCanEdit(albumId, userId);

    const existing = await albumSongRepository.find(albumId, songId);
    if (!existing) throw ApiError.notFound("Song not found in album");

    await albumSongRepository.remove(albumId, songId);
  },

  async listSongs(albumId: string, query: PaginationQuery) {
    await albumService.getById(albumId);
    const pagination = getPagination(query);
    const [items, total] = await Promise.all([
      albumSongRepository.findByAlbum(albumId, pagination.skip, pagination.take),
      albumSongRepository.countByAlbum(albumId),
    ]);
    return { items, meta: buildMeta(total, pagination) };
  },
};
