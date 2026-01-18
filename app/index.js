import React from "react";
import { StyleSheet, View } from "react-native";
import StepTrackerUI from "../components/StepTrackerUI";
import { useSteps } from "../context/StepsContext";

export default function Home() {
  const { weekSteps } = useSteps();

  return (
    <View style={styles.container}>
      {/* Logo */}

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
    backgroundColor: "#fffaee",
    paddingTop: 64,
  },
  logo: {
    textAlign: "center",
    fontSize: 32,
    fontWeight: "700",
    color: "#FF6B6B", // brand-accent color
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginBottom: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
