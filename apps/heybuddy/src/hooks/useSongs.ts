import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { songsApi } from "../api/songs";
import { queryKeys } from "./queryKeys";
import type {
  CreateSongInput,
  PaginationQuery,
  UpdateSongInput,
} from "../types/api";

export function useSongs(query?: PaginationQuery) {
  return useQuery({
    queryKey: queryKeys.songs.list(query),
    queryFn: () => songsApi.list(query),
  });
}

export function useSong(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.songs.detail(id ?? ""),
    queryFn: () => songsApi.getById(id as string),
    enabled: !!id,
  });
}

export function useCreateSong() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateSongInput) => songsApi.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.songs.all });
    },
  });
}

export function useUpdateSong() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateSongInput }) =>
      songsApi.update(id, input),
    onSuccess: (_res, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.songs.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.songs.all });
    },
  });
}

export function useDeleteSong() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => songsApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.songs.all });
    },
  });
}
