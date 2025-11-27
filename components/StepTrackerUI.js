// StepTrackerUI.js
// Full Expo-compatible code with two swipe pages using react-native-pager-view

import React, { useState } from "react";
import { Button, Dimensions, StyleSheet, Text, TextInput, View } from "react-native";
import { BarChart } from "react-native-chart-kit";
import PagerView from "react-native-pager-view";

export default function StepTrackerUI({ steps }) {
  const [goal, setGoal] = useState(10000);
  const [goalInput, setGoalInput] = useState("");

  const percentage = goal > 0 ? steps / goal : 0;

  const getCircleColor = () => {
    if (percentage < 0.3) return "#d62828";
    if (percentage < 0.6) return "#b58900";
    if (percentage < 0.9) return "#a3ff00";
    return "#007f33";
  };

  const weeklySteps = [5000, 7000, 8500, 4000, 12000, 9000, 6000];

  return (
    <PagerView style={styles.container} initialPage={0}>
      
      {/* PAGE 1 — Steps Circle */}
      <View key="1" style={styles.page}>
        <View style={[styles.circle, { borderColor: getCircleColor() }]}>
          <Text style={styles.stepsText}>{steps}</Text>
          <Text style={styles.goalText}>/ {goal}</Text>
        </View>

        <View style={styles.goalContainer}>
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

      {/* PAGE 2 — Weekly Chart */}
      <View key="2" style={styles.page}>
        <BarChart
          data={{
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [{ data: weeklySteps }],
          }}
          width={Dimensions.get("window").width - 20}
          height={300}
          fromZero
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: () => "#000",
            labelColor: () => "#000",
          }}
          style={{ marginTop: 20 }}
        />
      </View>

    </PagerView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  circle: {
    width: 220,
    height: 220,
    borderWidth: 12,
    borderRadius: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40
  },
  stepsText: {
    fontSize: 42,
    color: "#000",
    fontWeight: "bold"
  },
  goalText: {
    fontSize: 18,
    color: "#555",
    marginTop: 4
  },
  goalContainer: {
    width: "70%",
    alignItems: "center"
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8
  }
});
