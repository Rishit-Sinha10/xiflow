import { Router } from "express";
import {
  createLineup,
  getLineups,
  getLineup,
  updateLineup,
  deleteLineup,
  duplicateLineup,
  getLineupStats,
} from "../controllers/lineup.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validation.js";
import {
  createLineupSchema,
  updateLineupSchema,
  lineupParams,
} from "../utils/validators.js";

const router = Router();

router.use(requireAuth);

router.get("/", getLineups);
router.post("/", validate(createLineupSchema), createLineup);

router.get("/:id/stats", validate(lineupParams, "params"), getLineupStats);
router.post("/:id/duplicate", validate(lineupParams, "params"), duplicateLineup);
router.get("/:id", validate(lineupParams, "params"), getLineup);
router.put("/:id", validate(lineupParams, "params"), validate(updateLineupSchema), updateLineup);
router.delete("/:id", validate(lineupParams, "params"), deleteLineup);

export default router;
