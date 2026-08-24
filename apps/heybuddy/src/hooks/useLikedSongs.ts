import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { likedSongsApi } from "../api/likedSongs";
import { queryKeys } from "./queryKeys";
import type { PaginationQuery } from "../types/api";

export function useLikedSongs(query?: PaginationQuery) {
  return useQuery({
    queryKey: queryKeys.likedSongs.mine(query),
    queryFn: () => likedSongsApi.listMine(query),
  });
}

export function useLikeSong() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (songId: string) => likedSongsApi.like(songId),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.likedSongs.all });
    },
  });
}

export function useUnlikeSong() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (songId: string) => likedSongsApi.unlike(songId),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.likedSongs.all });
    },
  });
}
