import { albumRepository } from "../repositories/album.repository.js";
import { ApiError } from "../utils/ApiError.js";
import { getPagination, buildMeta, type PaginationQuery } from "../utils/pagination.js";
import type { CreateAlbumInput, UpdateAlbumInput } from "../utils/validators/album.schema.js";

export const albumService = {
  async create(ownerId: string, input: CreateAlbumInput) {
    return albumRepository.create({
      name: input.name,
      isCollaborative: input.isCollaborative ?? false,
      owner: { connect: { id: ownerId } },
    });
  },

  async getById(id: string) {
    const album = await albumRepository.findById(id);
    if (!album) throw ApiError.notFound("Album not found");
    return album;
  },

  async list(query: PaginationQuery & { ownerId?: string }) {
    const pagination = getPagination(query);
    const [items, total] = await Promise.all([
      albumRepository.findMany({
        ...pagination,
        ...(query.ownerId !== undefined ? { ownerId: query.ownerId } : {}),
      }),
      albumRepository.count(query.ownerId),
    ]);
    return { items, meta: buildMeta(total, pagination) };
  },

  /** Owner, or an editor when the album is collaborative, may modify it. */
  async assertCanEdit(albumId: string, userId: string) {
    const album = await this.getById(albumId);
    if (album.ownerId === userId) return album;

    if (album.isCollaborative) {
      const editor = await albumRepository.findEditor(albumId, userId);
      if (editor) return album;
    }

    throw ApiError.forbidden("You do not have permission to modify this album");
  },

  async update(id: string, userId: string, input: UpdateAlbumInput) {
    await this.assertCanEdit(id, userId);
    return albumRepository.update(id, {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.isCollaborative !== undefined
        ? { isCollaborative: input.isCollaborative }
        : {}),
    });
  },

  async remove(id: string, userId: string) {
    const album = await this.getById(id);
    if (album.ownerId !== userId) {
      throw ApiError.forbidden("Only the owner can delete this album");
    }
    await albumRepository.delete(id);
  },
};
