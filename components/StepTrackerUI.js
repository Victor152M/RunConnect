// StepTrackerUI.js
// Fully Expo-compatible swipe UI with chart + goal circle

import React, { useState } from "react";
import {
    Button,
    Dimensions,
    PanResponder,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { BarChart } from "react-native-chart-kit";

// ---- MAIN COMPONENT ----
export default function StepTrackerUI({ steps }) {
  const [page, setPage] = useState(0);
  const [goal, setGoal] = useState(10000);
  const [goalInput, setGoalInput] = useState("");

  const percentage = goal > 0 ? steps / goal : 0;

  // Choose circle color by progress %
  const getCircleColor = () => {
    if (percentage < 0.3) return "#d62828";
    if (percentage < 0.6) return "#b58900";
    if (percentage < 0.9) return "#a3ff00";
    return "#007f33";
  };

  const weeklySteps = [5000, 7000, 8500, 4000, 12000, 9000, 6000];

  // --- Basic swipe using PanResponder (works on Expo Web + iOS + Android) ---
  const swipe = PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 20,
    onPanResponderRelease: (_, g) => {
      if (g.dx < -40) setPage(1); // swipe left
      if (g.dx > 40) setPage(0); // swipe right
    },
  });

  return (
    <View style={styles.container} {...swipe.panHandlers}>
      {page === 0 ? (
        // ---- PAGE 1: Steps Circle ----
        <View style={styles.page}>
          <View
            style={[styles.circle, { borderColor: getCircleColor() }]}
          >
            <Text style={styles.steps}>{steps}</Text>
            <Text style={styles.goal}>/ {goal}</Text>
          </View>

          <View style={styles.goalBox}>
            <TextInput
              style={styles.input}
              placeholder="Enter new goal"
              keyboardType="numeric"
              value={goalInput}
              onChangeText={setGoalInput}
            />
            <Button
              title="Set Goal"
              onPress={() => {
                const v = parseInt(goalInput);
                if (!isNaN(v) && v > 0) setGoal(v);
              }}
            />
          </View>
        </View>
      ) : (
        // ---- PAGE 2: Weekly Chart ----
        <View style={styles.page}>
          <BarChart
            data={{
              labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              datasets: [{ data: weeklySteps }],
            }}
            width={Dimensions.get("window").width - 20}
            height={300}
            fromZero
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              color: () => "#000",
              labelColor: () => "#000",
              decimalPlaces: 0,
            }}
            style={{ marginTop: 20 }}
          />
        </View>
      )}
    </View>
  );
}

// ---- STYLES ----
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: 220,
    height: 220,
    borderWidth: 12,
    borderRadius: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  steps: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#000",
  },
  goal: {
    fontSize: 18,
    color: "#555",
    marginTop: 4,
  },
  goalBox: {
    width: "70%",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
});
