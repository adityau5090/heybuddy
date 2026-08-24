// ---------------------------------------------------------------------------
// Shared API types — mirrors the Prisma models / zod schemas in the server
// ---------------------------------------------------------------------------

export type Role = "USER" | "ADMIN"; // adjust to match your Prisma $Enums.Role
export type SessionRole = "GUEST" | "HOST";

export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiErrorBody {
  error: string;
  details?: unknown;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

// ---------------------------------------------------------------------------
// User
// ---------------------------------------------------------------------------
// Full record — only ever returned by GET /users/me and the self-service
// PATCH /users/:id (updating your own profile). The server intentionally
// omits email/role/premiumUntil from any other user-facing endpoint.
export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  role: Role;
  premiumUntil: string | null;
}

// Safe subset returned by GET /users and GET /users/:id (list/lookup of
// *other* users) — no email, role, or premiumUntil.
export interface PublicUser {
  id: string;
  name: string;
  image: string | null;
  createdAt: string;
}

export interface UpdateUserInput {
  name?: string;
  image?: string;
}

// ---------------------------------------------------------------------------
// Song
// ---------------------------------------------------------------------------
export interface Song {
  id: string;
  title: string;
  artist: string;
  coverUrl: string | null;
  audioUrl: string;
  duration: number;
  createdAt: string;
}

export interface CreateSongInput {
  title: string;
  artist: string;
  coverUrl?: string;
  audioUrl: string;
  duration: number;
}

export type UpdateSongInput = Partial<CreateSongInput>;

// ---------------------------------------------------------------------------
// LikedSong
// ---------------------------------------------------------------------------
export interface LikedSong {
  userId: string;
  songId: string;
  likedAt: string;
  song?: Song;
}

// ---------------------------------------------------------------------------
// Album
// ---------------------------------------------------------------------------
export interface Album {
  id: string;
  name: string;
  ownerId: string;
  isCollaborative: boolean;
  createdAt: string;
  // Backend doesn't currently `include` the owner relation on Album at all,
  // so this is always undefined today — typed as PublicUser (not User) so
  // that if it's ever wired up, it stays a reminder not to leak email/role.
  owner?: PublicUser;
  _count?: { song: number; editors: number };
}

export interface CreateAlbumInput {
  name: string;
  isCollaborative?: boolean;
}

export type UpdateAlbumInput = Partial<CreateAlbumInput>;

export interface AlbumSong {
  albumId: string;
  songId: string;
  addedAt: string;
  song?: Song;
}

export interface AlbumEditor {
  albumId: string;
  userId: string;
  user?: PublicUser;
}

// ---------------------------------------------------------------------------
// ListeningSession
// ---------------------------------------------------------------------------
export interface ListeningSession {
  id: string;
  joinCode: string;
  hostId: string;
  currentSondId: string | null; // NB: typo preserved from server schema (currentSondId)
  isPlaying: boolean;
  positionSeconds: number;
  positionUpdatedAt: string;
  createdAt: string;
  // Same caveat as Album.owner above — not currently included by the server.
  host?: PublicUser;
  currentSong?: Song | null;
  _count?: { participants: number; queue: number; messages: number };
}

export interface CreateListeningSessionInput {
  currentSondId?: string;
}

export interface UpdateListeningSessionInput {
  currentSondId?: string;
  isPlaying?: boolean;
  positionSeconds?: number;
}

// ---------------------------------------------------------------------------
// SessionParticipant
// ---------------------------------------------------------------------------
export interface SessionParticipant {
  sessionID: string;
  userId: string;
  role: SessionRole;
  joinedAt: string;
  // Server selects only { id, name } here (see sessionParticipant.repository.ts) —
  // PublicUser is a slight over-type (it also has image/createdAt) but never under-types.
  user?: PublicUser;
}

export interface JoinSessionInput {
  role?: SessionRole;
}

export interface UpdateParticipantInput {
  role: SessionRole;
}

// ---------------------------------------------------------------------------
// QueueItem
// ---------------------------------------------------------------------------
export interface QueueItem {
  id: string;
  sessionId: string;
  songId: string;
  addedById: string;
  position: number;
  createdAt: string;
  song?: Song;
  // Backend doesn't currently include this relation either — see Album.owner note above.
  addedBy?: PublicUser;
}

export interface AddQueueItemInput {
  songId: string;
  position?: number;
}

export interface UpdateQueueItemInput {
  position: number;
}

// ---------------------------------------------------------------------------
// SessionMessage
// ---------------------------------------------------------------------------
export interface SessionMessage {
  id: string;
  sessionId: string;
  userId: string;
  type: string;
  content: string;
  createdAt: string;
  // Server selects only { id, name, image } here (see sessionMessage.repository.ts).
  user?: PublicUser;
}

export interface CreateSessionMessageInput {
  type: "text" | "emoji" | string;
  content: string;
}

// ---------------------------------------------------------------------------
// Auth (better-auth email/password)
// ---------------------------------------------------------------------------
export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
