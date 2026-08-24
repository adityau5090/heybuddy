import { create } from "zustand";
import type { Song } from "../types/api";

interface PlayerState {
  activeSessionId: string | null;
  currentSong: Song | null;
  isPlaying: boolean;
  positionSeconds: number;

  setActiveSession: (sessionId: string | null) => void;
  setCurrentSong: (song: Song | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setPosition: (seconds: number) => void;
  reset: () => void;
}

/**
 * Purely local UI state for the mini-player / now-playing bar.
 * The source of truth for session playback lives on the server
 * (ListeningSession.isPlaying / positionSeconds) and is normally kept in
 * sync over the session's socket.io channel; this store just mirrors it
 * for fast, offline-friendly UI rendering between socket events.
 */
export const usePlayerStore = create<PlayerState>((set) => ({
  activeSessionId: null,
  currentSong: null,
  isPlaying: false,
  positionSeconds: 0,

  setActiveSession: (sessionId) => set({ activeSessionId: sessionId }),
  setCurrentSong: (song) => set({ currentSong: song }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setPosition: (seconds) => set({ positionSeconds: seconds }),
  reset: () =>
    set({
      activeSessionId: null,
      currentSong: null,
      isPlaying: false,
      positionSeconds: 0,
    }),
}));
