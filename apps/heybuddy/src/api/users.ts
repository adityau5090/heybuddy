import { apiRequest } from "../lib/api-client";
import type { PaginationQuery, PublicUser, UpdateUserInput, User } from "../types/api";

export const usersApi = {
  list: (query?: PaginationQuery) => apiRequest<PublicUser[]>("/users", { query }),

  me: () => apiRequest<User>("/users/me"),

  getById: (id: string) => apiRequest<PublicUser>(`/users/${id}`),

  update: (id: string, input: UpdateUserInput) =>
    apiRequest<User>(`/users/${id}`, { method: "PATCH", body: input }),

  remove: (id: string) => apiRequest<void>(`/users/${id}`, { method: "DELETE" }),
};
