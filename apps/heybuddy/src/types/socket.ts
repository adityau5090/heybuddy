import type { QueueItem } from "./api";

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

  // Full, ready-to-render queue — the server rebroadcasts the complete list
  // (same shape as GET /sessions/:id/queue) on every change, so this can be
  // written straight into the query cache without an extra fetch.
  "queue:updated": (payload: { queue: QueueItem[] }) => void;

  // Partial — only the fields that actually changed. Merge into whatever
  // session data you already have; don't treat this as a full session object.
  "playback:updated": (payload: {
    isPlaying: boolean;
    positionSeconds: number;
    currentSondId: string | null;
    positionUpdatedAt: string;
  }) => void;

  // NOTE: unlike "queue:updated", the pushed message here does NOT include
  // the sender's profile (the server's create-message path doesn't `include`
  // the user relation — only the paginated GET does). Don't render this
  // directly; refetch the messages list instead (see useSessionSocket).
  "message:new": (payload: { message: { id: string; sessionId: string; userId: string } }) => void;

  error: (payload: { message: string }) => void;
}
