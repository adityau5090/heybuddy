import type { Server } from "socket.io";
import { sessionParticipantService } from "../services/sessionParticipant.service.js";
import { sessionRoom } from "../utils/socketRooms.js";
import { toErrorMessage } from "../utils/socketError.js";
import { ApiError } from "../utils/ApiError.js";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "./events.js";
import type { AppSocket } from "./socket-auth.middleware.js";

type AppServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export function registerSessionHandlers(io: AppServer, socket: AppSocket): void {
  socket.on("session:join", async ({ sessionId }) => {
    try {
      const userId = socket.data.session.user.id;

      try {
        await sessionParticipantService.join(sessionId, userId);
      } catch (err) {
        // Already a participant (e.g. rejoining after a dropped connection) — not fatal.
        if (!(err instanceof ApiError && err.statusCode === 409)) throw err;
      }

      await socket.join(sessionRoom(sessionId));
      io.to(sessionRoom(sessionId)).emit("session:participant-joined", { userId });
    } catch (err) {
      socket.emit("error", { message: toErrorMessage(err) });
    }
  });

  socket.on("session:leave", async ({ sessionId }) => {
    try {
      const userId = socket.data.session.user.id;

      await socket.leave(sessionRoom(sessionId));
      io.to(sessionRoom(sessionId)).emit("session:participant-left", { userId });
    } catch (err) {
      socket.emit("error", { message: toErrorMessage(err) });
    }
  });
}
