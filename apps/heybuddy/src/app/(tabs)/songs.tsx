import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  useSongs,
  useCreateSong,
  useUpdateSong,
  useDeleteSong,
} from "@/hooks/useSongs";
import { useLikeSong, useUnlikeSong } from "@/hooks/useLikedSongs";
import type { Song } from "@/types/api";

export default function SongsScreen() {
  const { data, isLoading, isError, error, refetch, isRefetching } =
    useSongs({ page: 1, limit: 50 });

  const createSong = useCreateSong();
  const updateSong = useUpdateSong();
  const deleteSong = useDeleteSong();
  const likeSong = useLikeSong();
  const unlikeSong = useUnlikeSong();

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  const onCreate = () => {
    if (!title || !artist || !audioUrl) {
      Alert.alert("Missing fields", "Title, artist and audio URL are required.");
      return;
    }
    createSong.mutate(
      { title, artist, audioUrl, duration: 0 },
      {
        onSuccess: () => {
          setTitle("");
          setArtist("");
          setAudioUrl("");
        },
        onError: (err) => Alert.alert("Couldn't create song", err.message),
      },
    );
  };

  const onRename = (song: Song) => {
    Alert.prompt?.(
      "Rename song",
      undefined,
      (newTitle) => {
        if (newTitle && newTitle !== song.title) {
          updateSong.mutate({ id: song.id, input: { title: newTitle } });
        }
      },
      "plain-text",
      song.title,
    );
  };

  const onDelete = (song: Song) => {
    Alert.alert("Delete song", `Delete "${song.title}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteSong.mutate(song.id),
      },
    ]);
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error.message}</Text>
        <Pressable onPress={() => refetch()}>
          <Text style={styles.link}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Artist"
          value={artist}
          onChangeText={setArtist}
        />
        <TextInput
          style={styles.input}
          placeholder="Audio URL"
          autoCapitalize="none"
          value={audioUrl}
          onChangeText={setAudioUrl}
        />
        <Pressable
          style={styles.button}
          onPress={onCreate}
          disabled={createSong.isPending}
        >
          <Text style={styles.buttonText}>
            {createSong.isPending ? "Adding…" : "Add song"}
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={data?.data ?? []}
        keyExtractor={(item) => item.id}
        refreshing={isRefetching}
        onRefresh={refetch}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{item.title}</Text>
              <Text style={styles.rowSubtitle}>{item.artist}</Text>
            </View>
            <Pressable onPress={() => likeSong.mutate(item.id)}>
              <Text style={styles.action}>♥</Text>
            </Pressable>
            <Pressable onPress={() => onRename(item)}>
              <Text style={styles.action}>✎</Text>
            </Pressable>
            <Pressable onPress={() => onDelete(item)}>
              <Text style={[styles.action, styles.danger]}>🗑</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No songs yet — add one above.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8 },
  form: { padding: 16, gap: 8, borderBottomWidth: 1, borderColor: "#eee" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  },
  button: {
    backgroundColor: "#111",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
  },
  rowTitle: { fontSize: 16, fontWeight: "600" },
  rowSubtitle: { fontSize: 13, color: "#666" },
  action: { fontSize: 18, paddingHorizontal: 4 },
  danger: { color: "#c00" },
  empty: { textAlign: "center", marginTop: 40, color: "#888" },
  error: { color: "#c00" },
  link: { color: "#555", textDecorationLine: "underline" },
});
