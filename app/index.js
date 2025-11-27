import React from "react";
import { View } from "react-native";
import StepTrackerUI from "../components/StepTrackerUI";

export default function Home() {
  const steps = 4200; // ← подставь реальные шаги из Google Fit

  return (
    <View style={{ flex: 1 }}>
      <StepTrackerUI steps={steps} />
    </View>
  );
}
