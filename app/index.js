import React from "react";
import { StyleSheet, Text, View } from "react-native";
import StepTrackerUI from "../components/StepTrackerUI";
import { useSteps } from "../context/StepsContext";

export default function Home() {
  const { weekSteps } = useSteps();

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Text style={styles.logo}>RunConnect</Text>

      {/* Centered steps */}
      <View style={styles.center}>
        <StepTrackerUI weeklySteps={weekSteps} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    paddingTop: 32,
  },
  logo: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    color: "#991F26",
    marginBottom: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
