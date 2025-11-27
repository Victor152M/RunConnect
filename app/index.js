import StepTrackerUI from "@/components/StepTrackerUI";
import { View } from "react-native";

export default function Index() {

  // тестовые шаги — потом заменишь на реальные с Google Fit
  const steps = 4567;

  return (
    <View style={{ flex: 1 }}>
      <StepTrackerUI steps={steps} />
    </View>
  );
}
