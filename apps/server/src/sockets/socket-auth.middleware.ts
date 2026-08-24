import type { Socket } from "socket.io";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.js";
import type { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "./events.js";

export type AppSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export async function socketAuthMiddleware(
  socket: AppSocket,
  next: (err?: Error) => void,
): Promise<void> {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(socket.handshake.headers),
    });

    if (!session || !session.user) {
      next(new Error("Unauthorized"));
      return;
    }

    socket.data.session = session;
    next();
  } catch {
    next(new Error("Unauthorized"));
  }
}
