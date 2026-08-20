import type { Request, Response } from "express";
import { queueItemService } from "../services/queueItem.service.js";
import { sendSuccess } from "../utils/ApiResponse.js";
import { getUserId } from "../utils/getUserId.js";

export const queueItemController = {
  async add(req: Request, res: Response) {
    const addedById = getUserId(req);
    const item = await queueItemService.add(
      req.params.sessionId as string,
      addedById,
      req.body.songId,
      req.body.position,
    );
    sendSuccess(res, item, 201);
  },

  async list(req: Request, res: Response) {
    const items = await queueItemService.list(req.params.sessionId as string);
    sendSuccess(res, items);
  },

  async updatePosition(req: Request, res: Response) {
    const item = await queueItemService.updatePosition(req.params.id as string, req.body.position);
    sendSuccess(res, item);
  },

  async remove(req: Request, res: Response) {
    await queueItemService.remove(req.params.id as string);
    res.status(204).send();
  },
};
