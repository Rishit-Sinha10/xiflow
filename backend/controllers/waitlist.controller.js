import { waitlistService } from "../services/waitlist.services.js";
import { ok } from "../utils/formatters.js";

export async function joinWaitlist(req, res) {
  const { entry, alreadyJoined } = await waitlistService.join(req.body);
  return ok(res, { entry, alreadyJoined }, alreadyJoined ? 200 : 201);
}

export async function getWaitlist(req, res) {
  const entries = await waitlistService.list(req.query.limit);
  return ok(res, { count: entries.length, entries });
}
