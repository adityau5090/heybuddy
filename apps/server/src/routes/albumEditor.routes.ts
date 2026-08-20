import { Router } from "express";
import { albumEditorController } from "../controllers/albumEditor.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/require-auth.middleware.js";
import { AddAlbumEditorSchema } from "../utils/validators/albumEditor.schema.js";

const router: Router = Router({ mergeParams: true });

router.use(requireAuth);

router.get("/", asyncHandler(albumEditorController.listEditors));
router.post("/", validate(AddAlbumEditorSchema), asyncHandler(albumEditorController.addEditor));
router.delete("/:userId", asyncHandler(albumEditorController.removeEditor));

export default router;
