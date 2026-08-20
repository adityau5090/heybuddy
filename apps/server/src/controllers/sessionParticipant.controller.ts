import type { Request, Response } from "express";
import { sessionParticipantService } from "../services/sessionParticipant.service.js";
import { sendSuccess } from "../utils/ApiResponse.js";
import { getUserId } from "../utils/getUserId.js";

export const sessionParticipantController = {
  async join(req: Request, res: Response) {
    const userId = getUserId(req);
    const participant = await sessionParticipantService.join(
      req.params.sessionId as string,
      userId,
      req.body.role,
    );
    sendSuccess(res, participant, 201);
  },

  async leave(req: Request, res: Response) {
    const userId = getUserId(req);
    await sessionParticipantService.leave(req.params.sessionId as string, userId);
    res.status(204).send();
  },

  async list(req: Request, res: Response) {
    const participants = await sessionParticipantService.list(req.params.sessionId as string);
    sendSuccess(res, participants);
  },

  async updateRole(req: Request, res: Response) {
    const requesterId = getUserId(req);
    const participant = await sessionParticipantService.updateRole(
      req.params.sessionId as string,
      requesterId,
      req.params.userId as string,
      req.body.role,
    );
    sendSuccess(res, participant);
  },
};
