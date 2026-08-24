initialize a expo-55 project  -> start with "pnpm expo start"
add zustand @tanstack/react-query axios
pnpm add socket.io-client
pnpm add react-native-track-player
pnpm add expo-linking expo-secure-store






model User {
  id String @id @default(cuid())
  name String
  email String @unique
  role Role @default(USER)
  premiumUntil DateTime?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  likedSongs LikedSong[]
  albums Album[]
  hostedSession ListeningSession[] @relation("HostedSessions")
  participants SessionParticipant[]
  messages SessionMessage[]
}

model Song {
  id String @id @default(cuid())
  title String
  artist String
  coverUrl String?
  audioUrl String
  duration Int
  createdAt DateTime @default(now())

  likedBy LikedSong[]
  albumSong AlbumSong[]
  session ListeningSession[]
  queueItems QueueItem[]
}

model LikedSong {
  userId String
  songId String
  likedAt DateTime @default(now())
  user User @relation(fields: [userId], references: [id]) 
  song Song @relation(fields: [songId], references: [id])

  @@id([userId, songId])
}

model Album {
  id String @id @default(cuid())
  name String
  ownerId String
  isCollaborative Boolean @default(false)
  createdAt DateTime @default(now())

  owner User @relation(fields: [ownerId], references: [id])
  song AlbumSong[]
  editors AlbumEditor[]  
}

model AlbumSong{
  albumId String
  songId String
  addedAt DateTime @default(now())
  
  album Album @relation(fields: [albumId], references: [id])
  song Song @relation(fields: [songId], references: [id])

  @@id([albumId, songId])
}

model AlbumEditor {
  albumId String
  userId String

  album Album @relation(fields: [albumId], references: [id])

  @@id([albumId, userId])
}

model ListeningSession {
  id String @id @default(cuid())
  joinCode String @unique
  hostId String
  currentSondId String?
  isPlaying Boolean @default(false)
  positionSeconds Float @default(0)
  positionUpdatedAt DateTime @default(now())
  createdAt DateTime @default(now())

  host User @relation("HostedSessions", fields: [hostId], references: [id])
  currentSong Song? @relation(fields: [currentSondId], references: [id])

  participants SessionParticipant[]
  queue QueueItem[]
  messages SessionMessage[]
}

enum SessionRole {
  GUEST
  HOST
}

model SessionParticipant{
  sessionID String
  userId String
  role SessionRole @default(GUEST)
  joinedAt DateTime @default(now())

  session ListeningSession @relation(fields: [sessionID], references: [id])
  user User @relation(fields: [userId], references: [id])

  @@id([sessionID, userId])
}

model QueueItem{
  id String @id @default(cuid())
  sessionId String
  songId String
  addedById String
  position Int

  createdAt DateTime @default(now())
  
  session ListeningSession @relation(fields: [sessionId], references: [id])
  song Song @relation(fields: [songId], references: [id])
}

model SessionMessage {
  id String @id @default(cuid())
  sessionId String
  userId String
  type String
  content String
  createdAt DateTime @default(now())

  session ListeningSession @relation(fields: [sessionId], references: [id])
  user User @relation(fields: [userId], references: [id])
}