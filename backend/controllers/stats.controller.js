import { statsService } from "../services/stats.services.js";
import { ok } from "../utils/formatters.js";

export async function getOverview(req, res) {
  const stats = await statsService.overview(req.user.uid);
  return ok(res, { stats });
}
