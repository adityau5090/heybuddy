import { queueItemRepository } from "../repositories/queueItem.repository.js";
import { songRepository } from "../repositories/song.repository.js";
import { listeningSessionService } from "./listeningSession.service.js";
import { ApiError } from "../utils/ApiError.js";

export const queueItemService = {
  async add(sessionId: string, addedById: string, songId: string, position?: number) {
    await listeningSessionService.getById(sessionId);

    const song = await songRepository.findById(songId);
    if (!song) throw ApiError.notFound("Song not found");

    return queueItemRepository.add(sessionId, songId, addedById, position);
  },

  async list(sessionId: string) {
    await listeningSessionService.getById(sessionId);
    return queueItemRepository.findBySession(sessionId);
  },

  async getById(id: string) {
    const item = await queueItemRepository.findById(id);
    if (!item) throw ApiError.notFound("Queue item not found");
    return item;
  },

  async updatePosition(id: string, position: number) {
    await this.getById(id);
    return queueItemRepository.updatePosition(id, position);
  },

  async remove(id: string) {
    await this.getById(id);
    await queueItemRepository.delete(id);
  },
};
