import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/require-auth.middleware.js";
import { UpdateUserSchema } from "../utils/validators/user.schema.js";

const router: Router = Router();

router.get("/", requireAuth, asyncHandler(userController.list));
router.get("/me", requireAuth, asyncHandler(userController.me));
router.get("/:id", asyncHandler(userController.getById));
router.patch(
  "/:id",
  requireAuth,
  validate(UpdateUserSchema),
  asyncHandler(userController.update),
);
router.delete("/:id", requireAuth, asyncHandler(userController.remove));

export default router;
