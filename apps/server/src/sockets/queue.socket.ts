import type { Server } from "socket.io";
import { queueItemService } from "../services/queueItem.service.js";
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

async function broadcastQueue(io: AppServer, sessionId: string): Promise<void> {
  const queue = await queueItemService.list(sessionId);
  io.to(sessionRoom(sessionId)).emit("queue:updated", { queue });
}

export function registerQueueHandlers(io: AppServer, socket: AppSocket): void {
  socket.on("queue:add", async ({ sessionId, songId, position }) => {
    try {
      const userId = socket.data.session.user.id;
      await queueItemService.add(sessionId, userId, songId, position);
      await broadcastQueue(io, sessionId);
    } catch (err) {
      socket.emit("error", { message: toErrorMessage(err) });
    }
  });

  socket.on("queue:remove", async ({ sessionId, queueItemId }) => {
    try {
      await queueItemService.remove(queueItemId);
      await broadcastQueue(io, sessionId);
    } catch (err) {
      socket.emit("error", { message: toErrorMessage(err) });
    }
  });

  socket.on("queue:reorder", async ({ sessionId, queueItemId, position }) => {
    try {
      await queueItemService.updatePosition(queueItemId, position);
      await broadcastQueue(io, sessionId);
    } catch (err) {
      socket.emit("error", { message: toErrorMessage(err) });
    }
  });
}
