import { Router } from "express";
import { songController } from "../controllers/song.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/require-auth.middleware.js";
import { CreateSongSchema, UpdateSongSchema } from "../utils/validators/song.schema.js";

const router: Router = Router();

router.get("/", asyncHandler(songController.list));
router.get("/:id", asyncHandler(songController.getById));
router.post("/", requireAuth, validate(CreateSongSchema), asyncHandler(songController.create));
router.patch(
  "/:id",
  requireAuth,
  validate(UpdateSongSchema),
  asyncHandler(songController.update),
);
router.delete("/:id", requireAuth, asyncHandler(songController.remove));

export default router;
