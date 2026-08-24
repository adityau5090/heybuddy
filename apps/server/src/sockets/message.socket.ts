import type { Server } from "socket.io";
import { sessionMessageService } from "../services/sessionMessage.service.js";
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

export function registerMessageHandlers(io: AppServer, socket: AppSocket): void {
  socket.on("message:send", async ({ sessionId, type, content }) => {
    try {
      const userId = socket.data.session.user.id;
      const message = await sessionMessageService.create(sessionId, userId, type, content);
      io.to(sessionRoom(sessionId)).emit("message:new", { message });
    } catch (err) {
      socket.emit("error", { message: toErrorMessage(err) });
    }
  });
}
