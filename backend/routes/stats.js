import { Router } from "express";
import { getOverview } from "../controllers/stats.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, getOverview);

export default router;
