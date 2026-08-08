import { lineupService } from "../services/lineup.services.js";
import { ok, fail } from "../utils/formatters.js";

export async function createLineup(req, res) {
  const lineup = await lineupService.create(req.user.uid, req.body);
  return ok(res, { lineup }, 201);
}

export async function getLineups(req, res) {
  const lineups = await lineupService.list(req.user.uid);
  return ok(res, { lineups });
}

export async function getLineup(req, res) {
  const lineup = await lineupService.get(req.user.uid, req.validated.params.id);
  if (!lineup) return fail(res, "Lineup not found", 404);
  return ok(res, { lineup });
}

export async function updateLineup(req, res) {
  const lineup = await lineupService.update(
    req.user.uid,
    req.validated.params.id,
    req.body,
  );
  if (!lineup) return fail(res, "Lineup not found", 404);
  return ok(res, { lineup });
}

export async function deleteLineup(req, res) {
  const deleted = await lineupService.remove(req.user.uid, req.validated.params.id);
  if (!deleted) return fail(res, "Lineup not found", 404);
  return ok(res, { deleted: true });
}

export async function duplicateLineup(req, res) {
  const lineup = await lineupService.duplicate(req.user.uid, req.validated.params.id);
  if (!lineup) return fail(res, "Lineup not found", 404);
  return ok(res, { lineup }, 201);
}

export async function getLineupStats(req, res) {
  const stats = await lineupService.stats(req.user.uid, req.validated.params.id);
  if (!stats) return fail(res, "Lineup not found", 404);
  return ok(res, { stats });
}
