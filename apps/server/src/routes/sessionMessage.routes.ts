import { Router } from "express";
import { sessionMessageController } from "../controllers/sessionMessage.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/require-auth.middleware.js";
import { CreateSessionMessageSchema } from "../utils/validators/sessionMessage.schema.js";

const router: Router= Router({ mergeParams: true });

router.get("/", asyncHandler(sessionMessageController.list));

router.use(requireAuth);

router.post(
  "/",
  validate(CreateSessionMessageSchema),
  asyncHandler(sessionMessageController.create),
);
router.delete("/:id", asyncHandler(sessionMessageController.remove));

export default router;
