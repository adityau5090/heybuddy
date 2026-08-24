import type { Session } from "../lib/session.js";

/** Attached to socket.data by socketAuthMiddleware after a successful handshake. */
export interface SocketData {
  session: Session;
}

export interface ClientToServerEvents {
  "session:join": (payload: { sessionId: string }) => void;
  "session:leave": (payload: { sessionId: string }) => void;

  "queue:add": (payload: { sessionId: string; songId: string; position?: number }) => void;
  "queue:remove": (payload: { sessionId: string; queueItemId: string }) => void;
  "queue:reorder": (payload: {
    sessionId: string;
    queueItemId: string;
    position: number;
  }) => void;

  "playback:update": (payload: {
    sessionId: string;
    isPlaying?: boolean;
    positionSeconds?: number;
    currentSondId?: string;
  }) => void;

  "message:send": (payload: { sessionId: string; type: string; content: string }) => void;
}

export interface ServerToClientEvents {
  "session:participant-joined": (payload: { userId: string }) => void;
  "session:participant-left": (payload: { userId: string }) => void;

  "queue:updated": (payload: { queue: unknown[] }) => void;

  "playback:updated": (payload: {
    isPlaying: boolean;
    positionSeconds: number;
    currentSondId: string | null;
    positionUpdatedAt: Date;
  }) => void;

  "message:new": (payload: { message: unknown }) => void;

  error: (payload: { message: string }) => void;
}

// No inter-server events needed yet — placeholder for future horizontal scaling
// (e.g. Redis adapter broadcasting between Socket.io instances).
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface InterServerEvents {}
