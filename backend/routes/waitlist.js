import { Router } from "express";
import { joinWaitlist, getWaitlist } from "../controllers/waitlist.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validation.js";
import { waitlistSchema } from "../utils/validators.js";

const router = Router();

router.post("/", validate(waitlistSchema), joinWaitlist);
router.get("/", requireAuth, getWaitlist);

export default router;
