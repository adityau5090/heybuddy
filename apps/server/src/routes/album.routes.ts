import { Router } from "express";
import { albumController } from "../controllers/album.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/require-auth.middleware.js";
import { CreateAlbumSchema, UpdateAlbumSchema } from "../utils/validators/album.schema.js";
import albumSongRoutes from "./albumSong.routes.js";
import albumEditorRoutes from "./albumEditor.routes.js";

const router: Router = Router();

router.get("/", asyncHandler(albumController.list));
router.get("/:id", asyncHandler(albumController.getById));
router.post(
  "/",
  requireAuth,
  validate(CreateAlbumSchema),
  asyncHandler(albumController.create),
);
router.patch(
  "/:id",
  requireAuth,
  validate(UpdateAlbumSchema),
  asyncHandler(albumController.update),
);
router.delete("/:id", requireAuth, asyncHandler(albumController.remove));

router.use("/:albumId/songs", albumSongRoutes);
router.use("/:albumId/editors", albumEditorRoutes);

export default router;
