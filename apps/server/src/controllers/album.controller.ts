import type { Request, Response } from "express";
import { albumService } from "../services/album.service.js";
import { sendSuccess } from "../utils/ApiResponse.js";
import { getUserId } from "../utils/getUserId.js";

export const albumController = {
  async create(req: Request, res: Response) {
    const ownerId = getUserId(req);
    const album = await albumService.create(ownerId, req.body);
    sendSuccess(res, album, 201);
  },

  async getById(req: Request, res: Response) {
    const album = await albumService.getById(req.params.id as string);
    sendSuccess(res, album);
  },

  async list(req: Request, res: Response) {
    const ownerId = req.query.ownerId as string | undefined;
    const { items, meta } = await albumService.list({
      page: req.query.page as string,
      limit: req.query.limit as string,
      ...(ownerId !== undefined ? { ownerId } : {}),
    });
    sendSuccess(res, items, 200, meta);
  },

  async update(req: Request, res: Response) {
    const userId = getUserId(req);
    const album = await albumService.update(
      req.params.id as string,
      userId,
      req.body,
    );
    sendSuccess(res, album);
  },

  async remove(req: Request, res: Response) {
    const userId = getUserId(req);
    await albumService.remove(req.params.id as string, userId);
    res.status(204).send();
  },
};
