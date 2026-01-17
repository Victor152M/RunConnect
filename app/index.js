import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import StepTrackerUI from "../components/StepTrackerUI";
import { useFriends } from "../context/FriendsContext";
import { useSteps } from "../context/StepsContext";

export default function Home() {
  const { weekSteps } = useSteps();
  const { myName, setMyName } = useFriends();

  const [tempName, setTempName] = useState(myName);

  const onSetName = () => {
    if (!tempName.trim()) return;
    setMyName(tempName.trim());
  };

  return (
    <View style={styles.container}>
      {/* Name section */}
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

      {/* Steps */}
      <StepTrackerUI weeklySteps={weekSteps} />
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
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: "#111",
    color: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
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
});
