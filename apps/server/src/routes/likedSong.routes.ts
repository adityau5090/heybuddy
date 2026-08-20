import { Router } from "express";
import { likedSongController } from "../controllers/likedSong.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireAuth } from "../middleware/require-auth.middleware.js";

const router: Router = Router();

router.use(requireAuth);

router.get("/", asyncHandler(likedSongController.listMine));
router.post("/:songId", asyncHandler(likedSongController.like));
router.delete("/:songId", asyncHandler(likedSongController.unlike));

export default router;
