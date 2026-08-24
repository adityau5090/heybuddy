import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { albumsApi } from "../api/albums";
import { queryKeys } from "./queryKeys";
import type {
  CreateAlbumInput,
  PaginationQuery,
  UpdateAlbumInput,
} from "../types/api";

export function useAlbums(query?: PaginationQuery) {
  return useQuery({
    queryKey: queryKeys.albums.list(query),
    queryFn: () => albumsApi.list(query),
  });
}

export function useAlbum(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.albums.detail(id ?? ""),
    queryFn: () => albumsApi.getById(id as string),
    enabled: !!id,
  });
}

export function useCreateAlbum() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAlbumInput) => albumsApi.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.albums.all }),
  });
}

export function useUpdateAlbum() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateAlbumInput }) =>
      albumsApi.update(id, input),
    onSuccess: (_res, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.albums.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.albums.all });
    },
  });
}

export function useDeleteAlbum() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => albumsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.albums.all }),
  });
}

// --- nested: songs in album ---
export function useAlbumSongs(albumId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.albums.songs(albumId ?? ""),
    queryFn: () => albumsApi.listSongs(albumId as string),
    enabled: !!albumId,
  });
}

export function useAddSongToAlbum() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ albumId, songId }: { albumId: string; songId: string }) =>
      albumsApi.addSong(albumId, songId),
    onSuccess: (_res, { albumId }) =>
      qc.invalidateQueries({ queryKey: queryKeys.albums.songs(albumId) }),
  });
}

export function useRemoveSongFromAlbum() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ albumId, songId }: { albumId: string; songId: string }) =>
      albumsApi.removeSong(albumId, songId),
    onSuccess: (_res, { albumId }) =>
      qc.invalidateQueries({ queryKey: queryKeys.albums.songs(albumId) }),
  });
}

// --- nested: editors ---
export function useAlbumEditors(albumId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.albums.editors(albumId ?? ""),
    queryFn: () => albumsApi.listEditors(albumId as string),
    enabled: !!albumId,
  });
}

export function useAddAlbumEditor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ albumId, userId }: { albumId: string; userId: string }) =>
      albumsApi.addEditor(albumId, userId),
    onSuccess: (_res, { albumId }) =>
      qc.invalidateQueries({ queryKey: queryKeys.albums.editors(albumId) }),
  });
}

export function useRemoveAlbumEditor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ albumId, userId }: { albumId: string; userId: string }) =>
      albumsApi.removeEditor(albumId, userId),
    onSuccess: (_res, { albumId }) =>
      qc.invalidateQueries({ queryKey: queryKeys.albums.editors(albumId) }),
  });
}
