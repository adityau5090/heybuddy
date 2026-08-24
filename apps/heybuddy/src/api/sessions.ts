import { apiRequest } from "../lib/api-client";
import type {
  AddQueueItemInput,
  CreateListeningSessionInput,
  CreateSessionMessageInput,
  JoinSessionInput,
  ListeningSession,
  PaginationQuery,
  QueueItem,
  SessionMessage,
  SessionParticipant,
  UpdateListeningSessionInput,
  UpdateParticipantInput,
  UpdateQueueItemInput,
} from "../types/api";

export const sessionsApi = {
  list: (query?: PaginationQuery) =>
    apiRequest<ListeningSession[]>("/sessions", { query }),

  getById: (id: string) => apiRequest<ListeningSession>(`/sessions/${id}`),

  getByJoinCode: (joinCode: string) =>
    apiRequest<ListeningSession>(`/sessions/join/${joinCode}`),

  create: (input: CreateListeningSessionInput = {}) =>
    apiRequest<ListeningSession>("/sessions", { method: "POST", body: input }),

  update: (id: string, input: UpdateListeningSessionInput) =>
    apiRequest<ListeningSession>(`/sessions/${id}`, {
      method: "PATCH",
      body: input,
    }),

  remove: (id: string) => apiRequest<void>(`/sessions/${id}`, { method: "DELETE" }),

  // --- participants ---
  listParticipants: (sessionId: string) =>
    apiRequest<SessionParticipant[]>(`/sessions/${sessionId}/participants`),

  join: (sessionId: string, input: JoinSessionInput = {}) =>
    apiRequest<SessionParticipant>(`/sessions/${sessionId}/participants`, {
      method: "POST",
      body: input,
    }),

  leave: (sessionId: string) =>
    apiRequest<void>(`/sessions/${sessionId}/participants/me`, {
      method: "DELETE",
    }),

  updateParticipantRole: (
    sessionId: string,
    userId: string,
    input: UpdateParticipantInput,
  ) =>
    apiRequest<SessionParticipant>(
      `/sessions/${sessionId}/participants/${userId}/role`,
      { method: "PATCH", body: input },
    ),

  // --- queue ---
  listQueue: (sessionId: string) =>
    apiRequest<QueueItem[]>(`/sessions/${sessionId}/queue`),

  addToQueue: (sessionId: string, input: AddQueueItemInput) =>
    apiRequest<QueueItem>(`/sessions/${sessionId}/queue`, {
      method: "POST",
      body: input,
    }),

  updateQueuePosition: (
    sessionId: string,
    queueItemId: string,
    input: UpdateQueueItemInput,
  ) =>
    apiRequest<QueueItem>(`/sessions/${sessionId}/queue/${queueItemId}`, {
      method: "PATCH",
      body: input,
    }),

  removeFromQueue: (sessionId: string, queueItemId: string) =>
    apiRequest<void>(`/sessions/${sessionId}/queue/${queueItemId}`, {
      method: "DELETE",
    }),

  // --- messages ---
  listMessages: (sessionId: string, query?: PaginationQuery) =>
    apiRequest<SessionMessage[]>(`/sessions/${sessionId}/messages`, {
      query,
    }),

  sendMessage: (sessionId: string, input: CreateSessionMessageInput) =>
    apiRequest<SessionMessage>(`/sessions/${sessionId}/messages`, {
      method: "POST",
      body: input,
    }),

  removeMessage: (sessionId: string, messageId: string) =>
    apiRequest<void>(`/sessions/${sessionId}/messages/${messageId}`, {
      method: "DELETE",
    }),
};
