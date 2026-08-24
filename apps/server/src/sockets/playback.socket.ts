import type { Server } from "socket.io";
import { listeningSessionService } from "../services/listeningSession.service.js";
import { sessionRoom } from "../utils/socketRooms.js";
import { toErrorMessage } from "../utils/socketError.js";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "./events.js";
import type { AppSocket } from "./socket-auth.middleware.js";

type AppServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export function registerPlaybackHandlers(io: AppServer, socket: AppSocket): void {
  socket.on("playback:update", async ({ sessionId, isPlaying, positionSeconds, currentSondId }) => {
    try {
      const userId = socket.data.session.user.id;

      // listeningSessionService.update already enforces host-only access.
      const session = await listeningSessionService.update(sessionId, userId, {
        isPlaying,
        positionSeconds,
        currentSondId,
      });

      io.to(sessionRoom(sessionId)).emit("playback:updated", {
        isPlaying: session.isPlaying,
        positionSeconds: session.positionSeconds,
        currentSondId: session.currentSondId,
        positionUpdatedAt: session.positionUpdatedAt,
      });
    } catch (err) {
      socket.emit("error", { message: toErrorMessage(err) });
    }
  });
}
