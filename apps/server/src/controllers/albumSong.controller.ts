import type { Request, Response } from "express";
import { albumSongService } from "../services/albumSong.service.js";
import { sendSuccess } from "../utils/ApiResponse.js";
import { getUserId } from "../utils/getUserId.js";

export const albumSongController = {
  async addSong(req: Request, res: Response) {
    const userId = getUserId(req);
    const entry = await albumSongService.addSong(req.params.albumId as string, userId, req.body.songId);
    sendSuccess(res, entry, 201);
  },

  async removeSong(req: Request, res: Response) {
    const userId = getUserId(req);
    await albumSongService.removeSong(req.params.albumId as string, userId, req.params.songId as string);
    res.status(204).send();
  },

  async listSongs(req: Request, res: Response) {
    const { items, meta } = await albumSongService.listSongs(req.params.albumId as string, {
      page: req.query.page as string,
      limit: req.query.limit as string,
    });
    sendSuccess(res, items, 200, meta);
  },
};
