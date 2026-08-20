import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";

// Minimal shape check for Prisma known-request errors without importing
// the generated client here (keeps this middleware framework-agnostic).
function isPrismaKnownError(
  err: unknown,
): err is { code: string; meta?: Record<string, unknown> } {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    typeof (err as { code: unknown }).code === "string" &&
    (err as { code: string }).code.startsWith("P")
  );
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found`,
  });
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
): void {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
    return;
  }

  if (isPrismaKnownError(err)) {
    switch (err.code) {
      case "P2002":
        res.status(409).json({
          success: false,
          error: "A record with these unique fields already exists",
          details: err.meta,
        });
        return;
      case "P2025":
        res.status(404).json({
          success: false,
          error: "Record not found",
        });
        return;
      case "P2003":
        res.status(400).json({
          success: false,
          error: "Invalid reference to a related record",
          details: err.meta,
        });
        return;
      default:
        res.status(400).json({
          success: false,
          error: "Database request error",
          details: err.meta,
        });
        return;
    }
  }

  console.error(err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
}
