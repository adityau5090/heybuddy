import { Router } from "express";
import { listeningSessionController } from "../controllers/listeningSession.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/require-auth.middleware.js";
import {
  CreateListeningSessionSchema,
  UpdateListeningSessionSchema,
} from "../utils/validators/listeningSession.schema.js";
import sessionParticipantRoutes from "./sessionParticipant.routes.js";
import queueItemRoutes from "./queueItem.routes.js";
import sessionMessageRoutes from "./sessionMessage.routes.js";

const router: Router = Router();

router.get("/", asyncHandler(listeningSessionController.list));
router.get("/join/:joinCode", asyncHandler(listeningSessionController.getByJoinCode));
router.get("/:id", asyncHandler(listeningSessionController.getById));
router.post(
  "/",
  requireAuth,
  validate(CreateListeningSessionSchema),
  asyncHandler(listeningSessionController.create),
);
router.patch(
  "/:id",
  requireAuth,
  validate(UpdateListeningSessionSchema),
  asyncHandler(listeningSessionController.update),
);
router.delete("/:id", requireAuth, asyncHandler(listeningSessionController.remove));

router.use("/:sessionId/participants", sessionParticipantRoutes);
router.use("/:sessionId/queue", queueItemRoutes);
router.use("/:sessionId/messages", sessionMessageRoutes);

export default router;
