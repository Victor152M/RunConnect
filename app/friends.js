import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useFriends } from "../context/FriendsContext";

export default function Friends() {
  const { myName, friends, addFriend } = useFriends();
  const [friendName, setFriendName] = useState("");

  return (
    <View style={styles.container}>
      {/* Your name (read-only) */}
      <View style={styles.card}>
        <Text style={styles.label}>Your name</Text>
        <View style={styles.readOnlyInput}>
          <Text style={styles.readOnlyText}>
            {myName || "Not set"}
          </Text>
        </View>
        <Text style={styles.hint}>
          You can change your name on the Home screen
        </Text>
      </View>

      {/* Add friend */}
      <View style={styles.card}>
        <Text style={styles.label}>Add friend</Text>
        <TextInput
          value={friendName}
          onChangeText={setFriendName}
          placeholder="Friend name"
          placeholderTextColor="#777"
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (friendName.trim()) {
              addFriend(friendName.trim());
              setFriendName("");
            }
          }}
        >
          <Text style={styles.buttonText}>Add friend</Text>
        </TouchableOpacity>
      </View>

      {/* Friends list */}
      <View style={styles.card}>
        <Text style={styles.label}>Friends</Text>
        {friends.length === 0 && (
          <Text style={styles.empty}>No friends added yet</Text>
        )}
        {friends.map((f, i) => (
          <Text key={i} style={styles.friendItem}>
            • {f}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    padding: 16,
  },
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  label: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 8,
  },
  hint: {
    color: "#666",
    fontSize: 12,
    marginTop: 6,
  },
  input: {
    backgroundColor: "#111",
    color: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  readOnlyInput: {
    backgroundColor: "#111",
    borderRadius: 8,
    padding: 12,
  },
  readOnlyText: {
    color: "#fff",
  },
  button: {
    backgroundColor: "#991F26",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  empty: {
    color: "#666",
    fontStyle: "italic",
  },
  friendItem: {
    color: "#fff",
    marginTop: 6,
  },
});
