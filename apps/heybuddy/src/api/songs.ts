import { apiRequest } from "../lib/api-client";
import type {
  CreateSongInput,
  PaginationQuery,
  Song,
  UpdateSongInput,
} from "../types/api";

export const songsApi = {
  list: (query?: PaginationQuery) =>
    apiRequest<Song[]>("/songs", { query }),

  getById: (id: string) => apiRequest<Song>(`/songs/${id}`),

  create: (input: CreateSongInput) =>
    apiRequest<Song>("/songs", { method: "POST", body: input }),

  update: (id: string, input: UpdateSongInput) =>
    apiRequest<Song>(`/songs/${id}`, { method: "PATCH", body: input }),

  remove: (id: string) => apiRequest<void>(`/songs/${id}`, { method: "DELETE" }),
};
