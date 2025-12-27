import React from "react";
import { View } from "react-native";
import StepTrackerUI from "../components/StepTrackerUI";
import { useSteps } from "../context/StepsContext";

export default function Home() {
  const { todaySteps, weekSteps } = useSteps();

  return (
    <View style={{ flex: 1 }}>
      <StepTrackerUI weeklySteps={weekSteps} />
    </View>
  );
}
