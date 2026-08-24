import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket, type AppSocket } from "../lib/socket";
import { queryKeys } from "./queryKeys";
import { usePlayerStore } from "../store/player-store";
import type { ListeningSession, QueueItem } from "../types/api";

interface UseSessionSocketOptions {
  /** Called when the server emits an "error" event (e.g. a rejected action). */
  onError?: (message: string) => void;
}

/**
 * Mount this from whichever screen is actively viewing a listening session.
 * It joins the session's socket room on mount, patches the relevant
 * TanStack Query caches (and usePlayerStore) as events arrive, and leaves
 * the room on unmount or when `sessionId` changes.
 *
 * This only *listens*. To act (add to queue, toggle playback, send a
 * message), emit directly on the socket from wherever the action happens:
 *
 *   const socket = await getSocket();
 *   socket.emit("queue:add", { sessionId, songId });
 *
 * — the server rebroadcasts the result, which this hook then picks up.
 */
export function useSessionSocket(
  sessionId: string | undefined,
  { onError }: UseSessionSocketOptions = {},
) {
  const qc = useQueryClient();
  const socketRef = useRef<AppSocket | null>(null);

  // Kept in a ref so callers don't need to memoize onError to avoid
  // needlessly rejoining the room on every render.
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;

    (async () => {
      const socket = await getSocket();
      if (cancelled) return;
      socketRef.current = socket;

      usePlayerStore.getState().setActiveSession(sessionId);
      socket.emit("session:join", { sessionId });

      socket.on("queue:updated", ({ queue }) => {
        qc.setQueryData<{ data: QueueItem[] }>(
          queryKeys.sessions.queue(sessionId),
          (old) => (old ? { ...old, data: queue } : old),
        );
      });

      socket.on("playback:updated", (payload) => {
        usePlayerStore.getState().setIsPlaying(payload.isPlaying);
        usePlayerStore.getState().setPosition(payload.positionSeconds);

        qc.setQueryData<{ data: ListeningSession }>(
          queryKeys.sessions.detail(sessionId),
          (old) =>
            old
              ? {
                  ...old,
                  data: {
                    ...old.data,
                    isPlaying: payload.isPlaying,
                    positionSeconds: payload.positionSeconds,
                    currentSondId: payload.currentSondId,
                    positionUpdatedAt: payload.positionUpdatedAt,
                  },
                }
              : old,
        );
      });

      // The pushed payload doesn't include the sender's profile (see the
      // NOTE on ServerToClientEvents["message:new"] in types/socket.ts), so
      // refetch rather than cache a partial message.
      socket.on("message:new", () => {
        qc.invalidateQueries({ queryKey: queryKeys.sessions.messages(sessionId) });
      });

      socket.on("session:participant-joined", () => {
        qc.invalidateQueries({ queryKey: queryKeys.sessions.participants(sessionId) });
      });

      socket.on("session:participant-left", () => {
        qc.invalidateQueries({ queryKey: queryKeys.sessions.participants(sessionId) });
      });

      socket.on("error", ({ message }) => {
        onErrorRef.current?.(message);
      });
    })();

    return () => {
      cancelled = true;
      const socket = socketRef.current;
      if (!socket) return;

      socket.emit("session:leave", { sessionId });
      socket.off("queue:updated");
      socket.off("playback:updated");
      socket.off("message:new");
      socket.off("session:participant-joined");
      socket.off("session:participant-left");
      socket.off("error");
    };
  }, [sessionId, qc]);
}
