import { Router } from "express";
import { albumSongController } from "../controllers/albumSong.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/require-auth.middleware.js";
import { AddSongToAlbumSchema } from "../utils/validators/albumSong.schema.js";

const router: Router = Router({ mergeParams: true });

router.get("/", asyncHandler(albumSongController.listSongs));
router.post(
  "/",
  requireAuth,
  validate(AddSongToAlbumSchema),
  asyncHandler(albumSongController.addSong),
);
router.delete("/:songId", requireAuth, asyncHandler(albumSongController.removeSong));

export default router;
