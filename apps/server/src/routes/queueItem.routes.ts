import { Router } from "express";
import { queueItemController } from "../controllers/queueItem.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/require-auth.middleware.js";
import { AddQueueItemSchema, UpdateQueueItemSchema } from "../utils/validators/queueItem.schema.js";

const router: Router = Router({ mergeParams: true });

router.get("/", asyncHandler(queueItemController.list));

router.use(requireAuth);

router.post("/", validate(AddQueueItemSchema), asyncHandler(queueItemController.add));
router.patch(
  "/:id",
  validate(UpdateQueueItemSchema),
  asyncHandler(queueItemController.updatePosition),
);
router.delete("/:id", asyncHandler(queueItemController.remove));

export default router;
