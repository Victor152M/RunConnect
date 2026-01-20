import React, { useState } from "react";
import { Button, Dimensions, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

// Screen width for horizontal scrolling
const SCREEN_WIDTH = Dimensions.get("window").width;

export default function StepTrackerUI({ weeklySteps }) {
  const [goal, setGoal] = useState(10000);
  const [goalInput, setGoalInput] = useState("");

  const safeWeeklySteps = Array.isArray(weeklySteps) && weeklySteps.length === 7
    ? weeklySteps.map(v => (typeof v === "number" && !isNaN(v) ? v : 0))
    : [0, 0, 0, 0, 0, 0, 0];

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const maxWeek = Math.max(...safeWeeklySteps);

  const todayIndex = new Date().getDay();

  const todaySteps = Array.isArray(weeklySteps) && weeklySteps.length === 7
  ? weeklySteps[todayIndex] || 0
  : 0;

  const percent = goal > 0 ? todaySteps / goal : 0;

  const getColor = () => {
    if (percent < 0.3) return "#991F26";
    if (percent < 0.6) return "#b58900";
    if (percent < 0.9) return "#a3ff00";
    return "#007f33";
  };

  return (
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      style={{ flex: 1 }}
    >
      {/* PAGE 1 — Steps Circle */}
      <View style={[styles.page, { width: SCREEN_WIDTH }]}>
        <View style={[styles.circle, { borderColor: getColor() }]}>
          <Text style={styles.stepsText}>{todaySteps}</Text>
          <Text style={styles.goalText}>/ {goal}</Text>
        </View>

        <View style={styles.goalContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter goal"
            keyboardType="numeric"
            value={goalInput}
            onChangeText={setGoalInput}
          />
          <Button
            title="Set Goal"
            color="#991F26"
            onPress={() => {
              const n = parseInt(goalInput);
              if (!isNaN(n) && n > 0) setGoal(n);
            }}
          />
        </View>
      </View>

      {/* PAGE 2 — Weekly Chart */}
      <View style={[styles.page, { width: SCREEN_WIDTH }]}>
        <Text style={styles.weeklyTitle}>Weekly steps</Text>

        <View style={styles.chartContainer}>
          {safeWeeklySteps.map((v, i) => {
            const height = maxWeek > 0 ? (v / maxWeek) * 160 : 0;
            const safeHeight = isNaN(height) ? 0 : height;
            return (
              <View key={i} style={styles.barWrapper}>
                <Text style={styles.barValue}>{String(isNaN(v) ? 0 : v)}</Text>
                <View style={[styles.bar, { height: safeHeight }]} />
                <Text style={styles.barLabel}>{String(dayLabels[i] || "")}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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

  stepsText: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#000000",
  },

  goalText: {
    fontSize: 20,
    color: "#555",
  },

  goalContainer: {
    width: "70%",
    alignItems: "center",
  },

  input: {
    width: "100%",
    fontSize: 16,
    fontWeight: "bold",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 12,
    marginBottom: 28,
  },

  weeklyTitle: {
    marginBottom: 20,
    fontSize: 22,
    fontWeight: "600",
  },

  chartContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    height: 200,
  },

  barWrapper: {
    alignItems: "center",
    justifyContent: "flex-end",
    marginHorizontal: 4,
  },

  barValue: {
    fontSize: 12,
    marginBottom: 4,
    color: "#000000ff",
  },

  bar: {
    width: 30,
    backgroundColor: "#000",
    borderRadius: 6,
  },

  barLabel: {
    marginTop: 6,
    fontSize: 12,
  },
});
