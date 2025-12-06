import { Pedometer } from "expo-sensors";
import { useEffect } from "react";

type StepCounterProps = {
  onSteps: (steps: number) => void;
};

export default function StepCounter({ onSteps }: StepCounterProps) {
  useEffect(() => {
    const subscription = Pedometer.watchStepCount(result => {
      onSteps(result.steps);     // Передаём шаги в другой компонент
    });

    return () => subscription.remove();
  }, []);

  return null;
}
