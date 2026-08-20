import { Router } from "express";
import { sessionParticipantController } from "../controllers/sessionParticipant.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/require-auth.middleware.js";
import {
  JoinSessionSchema,
  UpdateParticipantSchema,
} from "../utils/validators/sessionParticipant.schema.js";

const router: Router = Router({ mergeParams: true });

router.get("/", asyncHandler(sessionParticipantController.list));

router.use(requireAuth);

router.post("/", validate(JoinSessionSchema), asyncHandler(sessionParticipantController.join));
router.delete("/me", asyncHandler(sessionParticipantController.leave));
router.patch(
  "/:userId/role",
  validate(UpdateParticipantSchema),
  asyncHandler(sessionParticipantController.updateRole),
);

export default router;
