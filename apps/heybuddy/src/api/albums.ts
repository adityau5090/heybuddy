import { apiRequest } from "../lib/api-client";
import type {
  Album,
  AlbumEditor,
  AlbumSong,
  CreateAlbumInput,
  PaginationQuery,
  UpdateAlbumInput,
} from "../types/api";

export const albumsApi = {
  list: (query?: PaginationQuery) => apiRequest<Album[]>("/albums", { query }),

  getById: (id: string) => apiRequest<Album>(`/albums/${id}`),

  create: (input: CreateAlbumInput) =>
    apiRequest<Album>("/albums", { method: "POST", body: input }),

  update: (id: string, input: UpdateAlbumInput) =>
    apiRequest<Album>(`/albums/${id}`, { method: "PATCH", body: input }),

  remove: (id: string) => apiRequest<void>(`/albums/${id}`, { method: "DELETE" }),

  // --- nested: songs in an album ---
  listSongs: (albumId: string) =>
    apiRequest<AlbumSong[]>(`/albums/${albumId}/songs`),

  addSong: (albumId: string, songId: string) =>
    apiRequest<AlbumSong>(`/albums/${albumId}/songs`, {
      method: "POST",
      body: { songId },
    }),

  removeSong: (albumId: string, songId: string) =>
    apiRequest<void>(`/albums/${albumId}/songs/${songId}`, {
      method: "DELETE",
    }),

  // --- nested: editors of a (collaborative) album ---
  listEditors: (albumId: string) =>
    apiRequest<AlbumEditor[]>(`/albums/${albumId}/editors`),

  addEditor: (albumId: string, userId: string) =>
    apiRequest<AlbumEditor>(`/albums/${albumId}/editors`, {
      method: "POST",
      body: { userId },
    }),

  removeEditor: (albumId: string, userId: string) =>
    apiRequest<void>(`/albums/${albumId}/editors/${userId}`, {
      method: "DELETE",
    }),
};
