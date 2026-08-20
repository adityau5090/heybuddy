import type { Request, Response } from "express";
import { likedSongService } from "../services/likedSong.service.js";
import { sendSuccess } from "../utils/ApiResponse.js";
import { getUserId } from "../utils/getUserId.js";

export const likedSongController = {
  async like(req: Request, res: Response) {
    const userId = getUserId(req);
    const liked = await likedSongService.like(userId, req.params.songId as string);
    sendSuccess(res, liked, 201);
  },

  async unlike(req: Request, res: Response) {
    const userId = getUserId(req);
    await likedSongService.unlike(userId, req.params.songId as string);
    res.status(204).send();
  },

  async listMine(req: Request, res: Response) {
    const userId = getUserId(req);
    const { items, meta } = await likedSongService.listForUser(userId, {
      page: req.query.page as string,
      limit: req.query.limit as string,
    });
    sendSuccess(res, items, 200, meta);
  },
};
