import type { Request } from "express";
import { ApiError } from "./ApiError.js";

/**
 * Reads the authenticated user's id from req.session.
 * Only call this in routes mounted behind the `requireAuth` middleware —
 * it throws if that middleware hasn't populated the session.
 */
export function getUserId(req: Request): string {
  const userId = req.session?.user?.id;
  if (!userId) throw ApiError.unauthorized();
  return userId;
}
