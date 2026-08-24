import type { Server } from "socket.io";
import { socketAuthMiddleware } from "./socket-auth.middleware.js";
import { registerSessionHandlers } from "./session.socket.js";
import { registerQueueHandlers } from "./queue.socket.js";
import { registerPlaybackHandlers } from "./playback.socket.js";
import { registerMessageHandlers } from "./message.socket.js";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "./events.js";

export type AppServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export function initializeSocket(io: AppServer): void {
  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    registerSessionHandlers(io, socket);
    registerQueueHandlers(io, socket);
    registerPlaybackHandlers(io, socket);
    registerMessageHandlers(io, socket);

    socket.on("disconnect", () => {
      // Socket.io automatically removes the socket from any rooms it had joined.
      // We intentionally don't remove the DB participant record here — a dropped
      // connection isn't the same as leaving the session; the client should emit
      // "session:leave" explicitly when the user actually leaves.
    });
  });
}
