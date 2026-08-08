import { playerService } from "../services/player.services.js";
import { ok, fail } from "../utils/formatters.js";

export async function listPlayers(req, res) {
  const { q, position, nationality, sort, limit, page } = req.validated?.query ?? {};
  const result = await playerService.list({ q, position, nationality, sort, limit, page });
  return ok(res, result);
}

export async function getPlayer(req, res) {
  const player = await playerService.getPlayer(req.validated?.params?.id);
  if (!player) return fail(res, "Player not found", 404);
  return ok(res, { player });
}

export async function searchPlayers(req, res) {
  try {
    const result = await playerService.search(req.validated?.query?.q);
    return ok(res, result);
  } catch (err) {
    if (err.status) return fail(res, err.message, err.status);
    throw err;
  }
}

export async function getPlayersByPosition(req, res) {
  const result = await playerService.getPlayersByPosition(req.validated?.params?.pos);
  return ok(res, result);
}
