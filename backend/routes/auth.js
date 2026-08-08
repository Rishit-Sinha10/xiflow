import { Router } from "express";
import {
  register,
  login,
  verifyToken,
  refreshToken,
  getUserProfileHandler,
  updateProfile,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validation.js";
import {
  registerSchema,
  loginSchema,
  refreshSchema,
  updateProfileSchema,
} from "../utils/validators.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/verify", verifyToken);
router.post("/refresh", validate(refreshSchema), refreshToken);

router.get("/user", requireAuth, getUserProfileHandler);
router.put("/user", requireAuth, validate(updateProfileSchema), updateProfile);

export default router;
