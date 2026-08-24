import { apiRequest } from "../lib/api-client";
import type { LikedSong, PaginationQuery } from "../types/api";

export const likedSongsApi = {
  listMine: (query?: PaginationQuery) =>
    apiRequest<LikedSong[]>("/liked-songs", { query }),

  like: (songId: string) =>
    apiRequest<LikedSong>(`/liked-songs/${songId}`, { method: "POST" }),

  unlike: (songId: string) =>
    apiRequest<void>(`/liked-songs/${songId}`, { method: "DELETE" }),
};
