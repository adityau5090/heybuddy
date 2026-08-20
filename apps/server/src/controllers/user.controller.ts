import type { Request, Response } from "express";
import { userService } from "../services/user.service.js";
import { sendSuccess } from "../utils/ApiResponse.js";
import { getUserId } from "../utils/getUserId.js";

export const userController = {
  async me(req: Request, res: Response) {
    const user = await userService.getById(getUserId(req));
    sendSuccess(res, user);
  },

  async getById(req: Request, res: Response) {
    const user = await userService.getById(req.params.id as string);
    sendSuccess(res, user);
  },

  async list(req: Request, res: Response) {
    const { items, meta } = await userService.list({
      page: req.query.page as string,
      limit: req.query.limit as string,
      ...(req.query.search !== undefined && {
        search: req.query.search as string,
      }),
    });
    sendSuccess(res, items, 200, meta);
  },

  async update(req: Request, res: Response) {
    const requesterId = getUserId(req);
    const user = await userService.updateProfile(req.params.id as string, requesterId, req.body);
    sendSuccess(res, user);
  },

  async remove(req: Request, res: Response) {
    const requesterId = getUserId(req);
    await userService.remove(req.params.id as string, requesterId);
    res.status(204).send();
  },
};
