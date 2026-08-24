import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sessionsApi } from "../api/sessions";
import { queryKeys } from "./queryKeys";
import type {
  AddQueueItemInput,
  CreateListeningSessionInput,
  CreateSessionMessageInput,
  JoinSessionInput,
  PaginationQuery,
  UpdateListeningSessionInput,
  UpdateParticipantInput,
  UpdateQueueItemInput,
} from "../types/api";

export function useSessions(query?: PaginationQuery) {
  return useQuery({
    queryKey: queryKeys.sessions.list(query),
    queryFn: () => sessionsApi.list(query),
  });
}

export function useSession(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.sessions.detail(id ?? ""),
    queryFn: () => sessionsApi.getById(id as string),
    enabled: !!id,
  });
}

export function useSessionByJoinCode(joinCode: string | undefined) {
  return useQuery({
    queryKey: queryKeys.sessions.byJoinCode(joinCode ?? ""),
    queryFn: () => sessionsApi.getByJoinCode(joinCode as string),
    enabled: !!joinCode && joinCode.length === 6,
  });
}

export function useCreateSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateListeningSessionInput = {}) =>
      sessionsApi.create(input),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.sessions.all }),
  });
}

export function useUpdateSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: UpdateListeningSessionInput;
    }) => sessionsApi.update(id, input),
    onSuccess: (_res, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.sessions.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.sessions.all });
    },
  });
}

export function useDeleteSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sessionsApi.remove(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.sessions.all }),
  });
}

// --- participants ---
export function useSessionParticipants(sessionId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.sessions.participants(sessionId ?? ""),
    queryFn: () => sessionsApi.listParticipants(sessionId as string),
    enabled: !!sessionId,
  });
}

export function useJoinSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      sessionId,
      input,
    }: {
      sessionId: string;
      input?: JoinSessionInput;
    }) => sessionsApi.join(sessionId, input),
    onSuccess: (_res, { sessionId }) =>
      qc.invalidateQueries({
        queryKey: queryKeys.sessions.participants(sessionId),
      }),
  });
}

export function useLeaveSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => sessionsApi.leave(sessionId),
    onSuccess: (_res, sessionId) =>
      qc.invalidateQueries({
        queryKey: queryKeys.sessions.participants(sessionId),
      }),
  });
}

export function useUpdateParticipantRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      sessionId,
      userId,
      input,
    }: {
      sessionId: string;
      userId: string;
      input: UpdateParticipantInput;
    }) => sessionsApi.updateParticipantRole(sessionId, userId, input),
    onSuccess: (_res, { sessionId }) =>
      qc.invalidateQueries({
        queryKey: queryKeys.sessions.participants(sessionId),
      }),
  });
}

// --- queue ---
export function useSessionQueue(sessionId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.sessions.queue(sessionId ?? ""),
    queryFn: () => sessionsApi.listQueue(sessionId as string),
    enabled: !!sessionId,
  });
}

export function useAddToQueue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      sessionId,
      input,
    }: {
      sessionId: string;
      input: AddQueueItemInput;
    }) => sessionsApi.addToQueue(sessionId, input),
    onSuccess: (_res, { sessionId }) =>
      qc.invalidateQueries({ queryKey: queryKeys.sessions.queue(sessionId) }),
  });
}

export function useUpdateQueuePosition() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      sessionId,
      queueItemId,
      input,
    }: {
      sessionId: string;
      queueItemId: string;
      input: UpdateQueueItemInput;
    }) => sessionsApi.updateQueuePosition(sessionId, queueItemId, input),
    onSuccess: (_res, { sessionId }) =>
      qc.invalidateQueries({ queryKey: queryKeys.sessions.queue(sessionId) }),
  });
}

export function useRemoveFromQueue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      sessionId,
      queueItemId,
    }: {
      sessionId: string;
      queueItemId: string;
    }) => sessionsApi.removeFromQueue(sessionId, queueItemId),
    onSuccess: (_res, { sessionId }) =>
      qc.invalidateQueries({ queryKey: queryKeys.sessions.queue(sessionId) }),
  });
}

// --- messages ---
export function useSessionMessages(
  sessionId: string | undefined,
  query?: PaginationQuery,
) {
  return useQuery({
    queryKey: queryKeys.sessions.messages(sessionId ?? "", query),
    queryFn: () => sessionsApi.listMessages(sessionId as string, query),
    enabled: !!sessionId,
  });
}

export function useSendMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      sessionId,
      input,
    }: {
      sessionId: string;
      input: CreateSessionMessageInput;
    }) => sessionsApi.sendMessage(sessionId, input),
    onSuccess: (_res, { sessionId }) =>
      qc.invalidateQueries({
        queryKey: queryKeys.sessions.messages(sessionId),
      }),
  });
}

export function useRemoveMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      sessionId,
      messageId,
    }: {
      sessionId: string;
      messageId: string;
    }) => sessionsApi.removeMessage(sessionId, messageId),
    onSuccess: (_res, { sessionId }) =>
      qc.invalidateQueries({
        queryKey: queryKeys.sessions.messages(sessionId),
      }),
  });
}
