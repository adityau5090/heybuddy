import { io, type Socket } from "socket.io-client";
import { API_BASE_URL, authClient } from "./auth-client";
import type { ClientToServerEvents, ServerToClientEvents } from "../types/socket";

export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

let socket: AppSocket | null = null;

/**
 * Returns a connected singleton socket, authenticated with the same
 * better-auth session cookie used by `apiRequest`. The server's
 * socketAuthMiddleware reads this cookie off the handshake headers
 * (see src/sockets/socket-auth.middleware.ts on the server) — it's the
 * same cookie-forwarding trick as api-client.ts, just for the socket
 * handshake instead of a fetch call.
 *
 * Always call this (rather than importing `io` directly) so the whole
 * app shares one connection instead of opening a socket per screen.
 */
export async function getSocket(): Promise<AppSocket> {
  if (socket?.connected) return socket;

  const cookie = await authClient.getCookie();

  // Rebuild the client rather than reusing a stale instance: extraHeaders are
  // only read once, at construction time, so if the session cookie changed
  // since the last connection (e.g. logged out and back in as someone else),
  // reusing the old instance would silently authenticate with the wrong — or
  // no — cookie.
  socket?.disconnect();
  socket = io(API_BASE_URL, {
    transports: ["websocket"],
    extraHeaders: cookie ? { Cookie: cookie } : undefined,
  });

  return socket;
}

/** Call on logout so an authenticated socket doesn't stay open after sign-out. */
export function disconnectSocket(): void {
  socket?.disconnect();
  socket = null;
}
