import type { Request, Response } from "express";
import { sessionMessageService } from "../services/sessionMessage.service.js";
import { sendSuccess } from "../utils/ApiResponse.js";
import { getUserId } from "../utils/getUserId.js";

export const sessionMessageController = {
  async create(req: Request, res: Response) {
    const userId = getUserId(req);
    const message = await sessionMessageService.create(
      req.params.sessionId as string,
      userId,
      req.body.type,
      req.body.content,
    );
    sendSuccess(res, message, 201);
  },

  async list(req: Request, res: Response) {
    const { items, meta } = await sessionMessageService.list(req.params.sessionId as string, {
      page: req.query.page as string,
      limit: req.query.limit as string,
    });
    sendSuccess(res, items, 200, meta);
  },

  async remove(req: Request, res: Response) {
    const userId = getUserId(req);
    await sessionMessageService.remove(req.params.id as string, userId);
    res.status(204).send();
  },
};
