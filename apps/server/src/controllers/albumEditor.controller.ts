import type { Request, Response } from "express";
import { albumEditorService } from "../services/albumEditor.service.js";
import { sendSuccess } from "../utils/ApiResponse.js";
import { getUserId } from "../utils/getUserId.js";

export const albumEditorController = {
  async addEditor(req: Request, res: Response) {
    const ownerId = getUserId(req);
    const editor = await albumEditorService.addEditor(
      req.params.albumId as string,
      ownerId,
      req.body.userId,
    );
    sendSuccess(res, editor, 201);
  },

  async removeEditor(req: Request, res: Response) {
    const ownerId = getUserId(req);
    await albumEditorService.removeEditor(req.params.albumId as string, ownerId, req.params.userId as string);
    res.status(204).send();
  },

  async listEditors(req: Request, res: Response) {
    const editors = await albumEditorService.listEditors(req.params.albumId as string);
    sendSuccess(res, editors);
  },
};
