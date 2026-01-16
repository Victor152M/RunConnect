import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { useFriends } from "../context/FriendsContext";

export default function Friends() {
  const { myName, setMyName, friends, addFriend } = useFriends();
  const [friendName, setFriendName] = useState("");

  return (
    <View style={{ flex: 1, padding: 36 }}>
      <Text style={{ fontSize: 18, marginBottom: 5 }}>Your name</Text>
      <TextInput
        value={myName}
        onChangeText={setMyName}
        placeholder="Enter your name"
        style={{ borderWidth: 1, padding: 8, marginBottom: 20 }}
      />

      <Text style={{ fontSize: 18, marginBottom: 5 }}>Add friend</Text>
      <TextInput
        value={friendName}
        onChangeText={setFriendName}
        placeholder="Friend name"
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
      />

      <Button 
        title="Add friend"
        color="#991F26"
        onPress={() => {
          if (friendName.trim()) {
            addFriend(friendName.trim());
            setFriendName("");
          }
        }}
      />

      <Text style={{ marginTop: 24, fontWeight: "bold", fontSize: 18 }}>Friends:</Text>
      {friends.map((f, i) => (
        <Text key={i}>• {f}</Text>
      ))}
    </View>
  );
}
