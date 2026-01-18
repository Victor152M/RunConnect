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
  const { myName, setMyName, friends, addFriend } = useFriends();

  const [tempName, setTempName] = useState(myName);
  const [friendName, setFriendName] = useState("");

  const onSetName = () => {
    if (!tempName.trim()) return;
    setMyName(tempName.trim());
  };

  return (
    <View style={styles.container}>
      {/* Set name */}
      <View style={styles.card}>
        <Text style={styles.label}>Your name</Text>
        <TextInput
          value={tempName}
          onChangeText={setTempName}
          placeholder="Enter your name"
          placeholderTextColor="#777"
          style={styles.input}
        />
        <TouchableOpacity style={styles.button} onPress={onSetName}>
          <Text style={styles.buttonText}>Set name</Text>
        </TouchableOpacity>
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
    backgroundColor: "#fffaee",
    padding: 16,
    paddingTop: 36,
  },
  card: {
    backgroundColor: "##fffaee",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  label: {
    color: "#000000",
    marginBottom: 8,
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#fffaee",
    color: "#000000",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#000000",
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
    color: "#000000",
    marginTop: 6,
    fontSize: 20,
  },
});
