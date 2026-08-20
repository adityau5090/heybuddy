import type { Request, Response } from "express";
import { listeningSessionService } from "../services/listeningSession.service.js";
import { sendSuccess } from "../utils/ApiResponse.js";
import { getUserId } from "../utils/getUserId.js";

export const listeningSessionController = {
  async create(req: Request, res: Response) {
    const hostId = getUserId(req);
    const session = await listeningSessionService.create(hostId, req.body);
    sendSuccess(res, session, 201);
  },

  async getById(req: Request, res: Response) {
    const session = await listeningSessionService.getById(
      req.params.id as string,
    );
    sendSuccess(res, session);
  },

  async getByJoinCode(req: Request, res: Response) {
    const session = await listeningSessionService.getByJoinCode(
      req.params.joinCode as string,
    );
    sendSuccess(res, session);
  },

  async list(req: Request, res: Response) {
    const { items, meta } = await listeningSessionService.list({
      page: req.query.page as string,
      limit: req.query.limit as string,
      ...(req.query.hostId ? { hostId: req.query.hostId as string } : {}),
    });
    sendSuccess(res, items, 200, meta);
  },

  async update(req: Request, res: Response) {
    const hostId = getUserId(req);
    const session = await listeningSessionService.update(
      req.params.id as string,
      hostId,
      req.body,
    );
    sendSuccess(res, session);
  },

  async remove(req: Request, res: Response) {
    const hostId = getUserId(req);
    await listeningSessionService.remove(req.params.id as string, hostId);
    res.status(204).send();
  },
};
