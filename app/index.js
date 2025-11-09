// React Native + Expo UI for step tracker with swipe navigation
// Uses react-native-gesture-handler + react-native-reanimated + react-native-swipe-gestures
// Two screens: StepsCircleScreen and WeeklyChartScreen
// Integrates with your previous step-fetching logic by passing `steps` as prop

import React, { useState } from "react";
import { Button, Dimensions, StyleSheet, Text, TextInput, View } from "react-native";
import { BarChart } from "react-native-chart-kit";
import GestureRecognizer from "react-native-swipe-gestures";

export default function StepTrackerUI({ steps }) {
  const [page, setPage] = useState(0);
  const [goal, setGoal] = useState(10000);
  const [goalInput, setGoalInput] = useState("");

  const percentage = goal > 0 ? steps / goal : 0;

  const getCircleColor = () => {
    if (percentage < 0.3) return "#d62828"; // red
    if (percentage < 0.6) return "#b58900"; // dark mustard yellow
    if (percentage < 0.9) return "#a3ff00"; // lime
    return "#007f33"; // dark green
  };

  const weeklySteps = [5000, 7000, 8500, 4000, 12000, 9000, 6000];

  const handleSwipeLeft = () => setPage((p) => Math.min(1, p + 1));
  const handleSwipeRight = () => setPage((p) => Math.max(0, p - 1));

  return (
    <GestureRecognizer onSwipeLeft={handleSwipeLeft} onSwipeRight={handleSwipeRight} style={styles.container}>
      {page === 0 ? (
        <View style={styles.page}>
          <View style={[styles.circle, { borderColor: getCircleColor() }]}>            <Text style={styles.stepsText}>{steps}</Text>            <Text style={styles.goalText}>/ {goal}</Text>          </View>

          <View style={styles.goalContainer}>            <TextInput              style={styles.input}              placeholder="Enter new goal"              keyboardType="numeric"              value={goalInput}              onChangeText={setGoalInput}            />            <Button              title="Set Goal"              onPress={() => {                const v = parseInt(goalInput);
                if (!isNaN(v) && v > 0) setGoal(v);
              }}            />          </View>
        </View>
      ) : (
        <View style={styles.page}>
          <BarChart            data={{              labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],              datasets: [{ data: weeklySteps }],            }}            width={Dimensions.get("window").width - 20}            height={300}            fromZero            chartConfig={{              backgroundColor: "#ffffff",              backgroundGradientFrom: "#ffffff",              backgroundGradientTo: "#ffffff",              decimalPlaces: 0,              color: () => "#000",              labelColor: () => "#000",            }}            style={{ marginTop: 20 }}          />        </View>
      )}
    </GestureRecognizer>
  );
}

const styles = StyleSheet.create({  container: {    flex: 1,    backgroundColor: "#fff",    justifyContent: "center",    alignItems: "center",  },  page: {    flex: 1,    justifyContent: "center",    alignItems: "center",    width: "100%",  },  circle: {    width: 220,    height: 220,    borderWidth: 12,    borderRadius: 200,    justifyContent: "center",    alignItems: "center",    marginBottom: 40,  },  stepsText: {    fontSize: 42,    color: "#000",    fontWeight: "bold",  },  goalText: {    fontSize: 18,    color: "#555",    marginTop: 4,  },  goalContainer: {    width: "70%",    alignItems: "center",  },  input: {    borderWidth: 1,    borderColor: "#ccc",    width: "100%",    padding: 10,    marginBottom: 10,    borderRadius: 8,  },});