import { API_BASE_URL, authClient } from "./auth-client";
import type { ApiErrorBody, ApiSuccess } from "../types/api";

export class ApiClientError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.details = details;
  }
}

/**
 * Generic over `T extends object` (rather than a fixed `Record<string, X>`)
 * so callers can pass a concrete interface like `PaginationQuery` directly —
 * TypeScript only requires assignability to `Record<string, X>` when the
 * parameter type is that Record directly, not when it's inferred through a
 * generic constrained to `object`.
 */
function buildQuery<T extends object>(params?: T): string {
  if (!params) return "";
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) usp.append(key, String(value));
  });
  const qs = usp.toString();
  return qs ? `?${qs}` : "";
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  query?: object;
}

/**
 * Core request function used by every resource module in `src/api`.
 * - Prefixes paths with `${API_BASE_URL}/api`
 * - Attaches the better-auth session cookie (works for both the Expo
 *   client's own /api/auth/* routes and your custom /api/* routes)
 * - Unwraps the `{ success, data, meta }` envelope from `sendSuccess`
 * - Throws `ApiClientError` on non-2xx responses
 */
export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<{ data: T; meta?: ApiSuccess<T>["meta"] }> {
  const { method = "GET", body, query } = options;

  const cookie = await authClient.getCookie();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (cookie) headers["Cookie"] = cookie;

  const res = await fetch(`${API_BASE_URL}/api${path}${buildQuery(query)}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await res.json() : undefined;

  if (!res.ok) {
    const err = payload as ApiErrorBody | undefined;
    throw new ApiClientError(
      res.status,
      err?.error ?? res.statusText ?? "Request failed",
      err?.details,
    );
  }

  // 204 No Content (every DELETE endpoint on the server) has no body to parse —
  // there's nothing to unwrap, so return `data: undefined` rather than crash
  // trying to read `.data` off a payload that was never sent.
  if (res.status === 204 || payload === undefined) {
    return { data: undefined as T, meta: undefined };
  }

  const success = payload as ApiSuccess<T>;
  return { data: success.data, meta: success.meta };
}
