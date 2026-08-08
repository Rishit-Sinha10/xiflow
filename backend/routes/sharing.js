import { Router } from "express";
import {
  createShareLink,
  getSharedLineup,
  deleteShareLink,
  getShareStats,
} from "../controllers/sharing.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validation.js";
import {
  createShareSchema,
  lineupIdParams,
  accessCodeParams,
  shareIdParams,
} from "../utils/validators.js";
const router = Router();
router.get("/:accessCode", validate(accessCodeParams, "params"), getSharedLineup);
router.post("/lineups/:id", requireAuth, validate(lineupIdParams, "params"), validate(createShareSchema), createShareLink);
router.delete("/:shareId", requireAuth, validate(shareIdParams, "params"), deleteShareLink);
router.get("/:shareId/stats", requireAuth, validate(shareIdParams, "params"), getShareStats);
export default router;
