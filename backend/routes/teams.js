import { Router } from "express";
import {
  createTeam,
  getTeams,
  getTeam,
  updateTeam,
  deleteTeam,
  addTeamMember,
  removeTeamMember,
} from "../controllers/team.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validation.js";
import {
  createTeamSchema,
  updateTeamSchema,
  teamParams,
  teamMemberParams,
  addTeamMemberSchema,
} from "../utils/validators.js";

const router = Router();

router.use(requireAuth);

router.get("/", getTeams);
router.post("/", validate(createTeamSchema), createTeam);

router.get("/:id", validate(teamParams, "params"), getTeam);
router.put("/:id", validate(teamParams, "params"), validate(updateTeamSchema), updateTeam);
router.delete("/:id", validate(teamParams, "params"), deleteTeam);

router.post("/:id/members", validate(teamParams, "params"), validate(addTeamMemberSchema), addTeamMember);
router.delete("/:id/members/:memberUid", validate(teamMemberParams, "params"), removeTeamMember);

export default router;
