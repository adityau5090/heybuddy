import { listeningSessionRepository } from "../repositories/listeningSession.repository.js";
import { ApiError } from "../utils/ApiError.js";
import { getPagination, buildMeta, type PaginationQuery } from "../utils/pagination.js";
import type {
  CreateListeningSessionInput,
  UpdateListeningSessionInput,
} from "../utils/validators/listeningSession.schema.js";

export const listeningSessionService = {
  async create(hostId: string, input: CreateListeningSessionInput) {
    return listeningSessionRepository.create(hostId, {
      ...(input.currentSondId
        ? { currentSong: { connect: { id: input.currentSondId } } }
        : {}),
    });
  },

  async getById(id: string) {
    const session = await listeningSessionRepository.findById(id);
    if (!session) throw ApiError.notFound("Listening session not found");
    return session;
  },

  async getByJoinCode(joinCode: string) {
    const session = await listeningSessionRepository.findByJoinCode(joinCode);
    if (!session) throw ApiError.notFound("Listening session not found");
    return session;
  },

  async list(query: PaginationQuery & { hostId?: string }) {
    const pagination = getPagination(query);
    const [items, total] = await Promise.all([
      listeningSessionRepository.findMany({ ...pagination, hostId: query.hostId }),
      listeningSessionRepository.count(query.hostId),
    ]);
    return { items, meta: buildMeta(total, pagination) };
  },

  async assertIsHost(sessionId: string, userId: string) {
    const session = await this.getById(sessionId);
    if (session.hostId !== userId) {
      throw ApiError.forbidden("Only the host can perform this action");
    }
    return session;
  },

  async update(id: string, hostId: string, input: UpdateListeningSessionInput) {
    await this.assertIsHost(id, hostId);

    const { currentSondId, ...rest } = input;
    return listeningSessionRepository.update(id, {
      ...rest,
      ...(currentSondId !== undefined
        ? { currentSong: { connect: { id: currentSondId } } }
        : {}),
      positionUpdatedAt: new Date(),
    });
  },

  async remove(id: string, hostId: string) {
    await this.assertIsHost(id, hostId);
    await listeningSessionRepository.delete(id);
  },
};
