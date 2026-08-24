// Centralised query keys so invalidation stays consistent everywhere.
export const queryKeys = {
  songs: {
    all: ["songs"] as const,
    list: (query?: object) => ["songs", "list", query] as const,
    detail: (id: string) => ["songs", "detail", id] as const,
  },
  likedSongs: {
    all: ["likedSongs"] as const,
    mine: (query?: object) => ["likedSongs", "mine", query] as const,
  },
  albums: {
    all: ["albums"] as const,
    list: (query?: object) => ["albums", "list", query] as const,
    detail: (id: string) => ["albums", "detail", id] as const,
    songs: (albumId: string) => ["albums", albumId, "songs"] as const,
    editors: (albumId: string) => ["albums", albumId, "editors"] as const,
  },
  sessions: {
    all: ["sessions"] as const,
    list: (query?: object) => ["sessions", "list", query] as const,
    detail: (id: string) => ["sessions", "detail", id] as const,
    byJoinCode: (code: string) => ["sessions", "joinCode", code] as const,
    participants: (sessionId: string) =>
      ["sessions", sessionId, "participants"] as const,
    queue: (sessionId: string) => ["sessions", sessionId, "queue"] as const,
    messages: (sessionId: string, query?: object) =>
      ["sessions", sessionId, "messages", query] as const,
  },
  users: {
    all: ["users"] as const,
    list: (query?: object) => ["users", "list", query] as const,
    detail: (id: string) => ["users", "detail", id] as const,
    me: () => ["users", "me"] as const,
  },
};
