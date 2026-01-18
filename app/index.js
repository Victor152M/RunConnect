import React from "react";
import { StyleSheet, Text, View } from "react-native";
import StepTrackerUI from "../components/StepTrackerUI";
import { useSteps } from "../context/StepsContext";

export default function Home() {
  const { weekSteps } = useSteps();

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>RunConnect</Text>
      </View>

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
    paddingTop: 80,
  },
  logoContainer: {
    backgroundColor: "#991F26",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: "center",
    marginBottom: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    borderBottom: 0,
    marginBottom: 0,
  },
  logo: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "700",
    color: "#FFFFFF", // white text for contrast
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0,
    paddingTop: 0,
    borderTop: 0,
  },
});
