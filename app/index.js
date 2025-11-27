import { StyleSheet, View } from "react-native";
import StepTrackerUI from "../components/StepTrackerUI";

export default function Index() {
  const steps = 5342; // ← сюда передашь настоящий шагомер позже

  return (
    <View style={styles.container}>
      <StepTrackerUI steps={steps} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
