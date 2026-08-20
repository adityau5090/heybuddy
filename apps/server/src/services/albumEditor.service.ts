import { albumEditorRepository } from "../repositories/albumEditor.repository.js";
import { albumService } from "./album.service.js";
import { ApiError } from "../utils/ApiError.js";

export const albumEditorService = {
  async addEditor(albumId: string, ownerId: string, userId: string) {
    const album = await albumService.getById(albumId);
    if (album.ownerId !== ownerId) {
      throw ApiError.forbidden("Only the owner can add editors");
    }

    const existing = await albumEditorRepository.find(albumId, userId);
    if (existing) throw ApiError.conflict("User is already an editor");

    return albumEditorRepository.add(albumId, userId);
  },

  async removeEditor(albumId: string, ownerId: string, userId: string) {
    const album = await albumService.getById(albumId);
    if (album.ownerId !== ownerId) {
      throw ApiError.forbidden("Only the owner can remove editors");
    }

    const existing = await albumEditorRepository.find(albumId, userId);
    if (!existing) throw ApiError.notFound("Editor not found");

    await albumEditorRepository.remove(albumId, userId);
  },

  async listEditors(albumId: string) {
    await albumService.getById(albumId);
    return albumEditorRepository.findByAlbum(albumId);
  },
};
