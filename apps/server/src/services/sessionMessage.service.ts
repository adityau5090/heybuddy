import { sessionMessageRepository } from "../repositories/sessionMessage.repository.js";
import { listeningSessionService } from "./listeningSession.service.js";
import { ApiError } from "../utils/ApiError.js";
import { getPagination, buildMeta, type PaginationQuery } from "../utils/pagination.js";

export const sessionMessageService = {
  async create(sessionId: string, userId: string, type: string, content: string) {
    await listeningSessionService.getById(sessionId);
    return sessionMessageRepository.create(sessionId, userId, type, content);
  },

  async list(sessionId: string, query: PaginationQuery) {
    await listeningSessionService.getById(sessionId);
    const pagination = getPagination(query);
    const [items, total] = await Promise.all([
      sessionMessageRepository.findBySession(sessionId, pagination.skip, pagination.take),
      sessionMessageRepository.countBySession(sessionId),
    ]);
    return { items, meta: buildMeta(total, pagination) };
  },

  async remove(id: string, requesterId: string) {
    const message = await sessionMessageRepository.findById(id);
    if (!message) throw ApiError.notFound("Message not found");

    if (message.userId !== requesterId) {
      const session = await listeningSessionService.getById(message.sessionId);
      if (session.hostId !== requesterId) {
        throw ApiError.forbidden("You cannot delete this message");
      }
    }

    await sessionMessageRepository.delete(id);
  },
};
