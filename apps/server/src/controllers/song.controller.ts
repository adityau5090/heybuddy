import type { Request, Response } from "express";
import { songService } from "../services/song.service.js";
import { sendSuccess } from "../utils/ApiResponse.js";

export const songController = {
  async create(req: Request, res: Response) {
    const song = await songService.create(req.body);
    sendSuccess(res, song, 201);
  },

  async getById(req: Request, res: Response) {
    const song = await songService.getById(req.params.id as string);
    sendSuccess(res, song);
  },

  async list(req: Request, res: Response) {
    const { items, meta } = await songService.list({
      page: req.query.page as string,
      limit: req.query.limit as string,
      ...(req.query.search !== undefined && {
        search: req.query.search as string,
      }),
    });
    sendSuccess(res, items, 200, meta);
  },

  async update(req: Request, res: Response) {
    const song = await songService.update(req.params.id as string, req.body);
    sendSuccess(res, song);
  },

  async remove(req: Request, res: Response) {
    await songService.remove(req.params.id as string);
    res.status(204).send();
  },
};
