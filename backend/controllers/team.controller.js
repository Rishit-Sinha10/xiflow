import { teamService } from "../services/team.services.js";
import { ok, fail } from "../utils/formatters.js";

export async function createTeam(req, res) {
  const team = await teamService.create(req.user.uid, req.body);
  return ok(res, { team }, 201);
}

export async function getTeams(req, res) {
  const teams = await teamService.list(req.user.uid);
  return ok(res, { teams });
}

export async function getTeam(req, res) {
  const team = await teamService.get(req.user.uid, req.validated.params.id);
  if (!team) return fail(res, "Team not found", 404);
  return ok(res, { team });
}

export async function updateTeam(req, res) {
  const team = await teamService.update(
    req.user.uid,
    req.validated.params.id,
    req.body,
  );
  if (!team) return fail(res, "Team not found", 404);
  return ok(res, { team });
}

export async function deleteTeam(req, res) {
  const deleted = await teamService.remove(req.user.uid, req.validated.params.id);
  if (!deleted) return fail(res, "Team not found", 404);
  return ok(res, { deleted: true });
}

export async function addTeamMember(req, res) {
  const team = await teamService.addMember(
    req.user.uid,
    req.validated.params.id,
    req.body.uid,
  );
  if (!team) return fail(res, "Team not found", 404);
  return ok(res, { team });
}

export async function removeTeamMember(req, res) {
  const team = await teamService.removeMember(
    req.user.uid,
    req.validated.params.id,
    req.validated.params.memberUid,
  );
  if (!team) return fail(res, "Team not found", 404);
  return ok(res, { team });
}
