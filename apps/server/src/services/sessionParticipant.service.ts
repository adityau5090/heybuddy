import { sessionParticipantRepository } from "../repositories/sessionParticipant.repository.js";
import { listeningSessionService } from "./listeningSession.service.js";
import { ApiError } from "../utils/ApiError.js";
import type { $Enums } from "../generated/prisma/client.js";

export const sessionParticipantService = {
  async join(sessionID: string, userId: string, role?: $Enums.SessionRole) {
    await listeningSessionService.getById(sessionID);

    const existing = await sessionParticipantRepository.find(sessionID, userId);
    if (existing) throw ApiError.conflict("Already joined this session");

    return sessionParticipantRepository.join(sessionID, userId, role);
  },

  async leave(sessionID: string, userId: string) {
    const existing = await sessionParticipantRepository.find(sessionID, userId);
    if (!existing) throw ApiError.notFound("Participant not found");

    await sessionParticipantRepository.leave(sessionID, userId);
  },

  async list(sessionID: string) {
    await listeningSessionService.getById(sessionID);
    return sessionParticipantRepository.findBySession(sessionID);
  },

  async updateRole(
    sessionID: string,
    requesterId: string,
    targetUserId: string,
    role: $Enums.SessionRole,
  ) {
    await listeningSessionService.assertIsHost(sessionID, requesterId);

    const existing = await sessionParticipantRepository.find(sessionID, targetUserId);
    if (!existing) throw ApiError.notFound("Participant not found");

    return sessionParticipantRepository.updateRole(sessionID, targetUserId, role);
  },
};
