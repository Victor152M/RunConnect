import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pedometer } from "expo-sensors";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";

type WeekData = number[];

type StepsContextType = {
  todaySteps: number;
  weekSteps: WeekData;
};

const StepsContext = createContext<StepsContextType>({
  todaySteps: 0,
  weekSteps: [],
});

type Props = {
  children: React.ReactNode;
};

export function StepsProvider({ children }: Props) {
  const [todaySteps, setTodaySteps] = useState(0);
  const [weekSteps, setWeekSteps] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);

  // ---- COUNT STEPS ----
  useEffect(() => {
    (async () => {
      // Only handle Android for now
      if (Platform.OS !== "android") return;

      // 1. Request permission for step counter
      const { status } = await Pedometer.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("Step permission not granted");
        return; // Stop if permission is denied
      }

      // 2. Check if pedometer is available
      const available = await Pedometer.isAvailableAsync();
      if (!available) {
        console.log("Pedometer is not available on this device");
        return;
      }

      // 3. Subscribe to step count updates
      const subscription = Pedometer.watchStepCount(result => {
        const steps = result.steps;
        setTodaySteps(steps);

        // Get day index (0 = Sunday)
        const day = new Date().getDay();

        // Update weekly steps
        setWeekSteps(prev => {
          const updated = [...prev];
          updated[day] = steps;
          AsyncStorage.setItem("WEEK_STEPS", JSON.stringify(updated));
          return updated;
        });
      });

      // 4. Clean up subscription on unmount
      return () => subscription.remove();
    })();
  }, []);

  // ---- LOAD SAVED WEEKLY DATA ----
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("WEEK_STEPS");
      if (saved) setWeekSteps(JSON.parse(saved));
    })();
  }, []);

  return (
    <StepsContext.Provider value={{ todaySteps, weekSteps }}>
      {children}
    </StepsContext.Provider>
  );
}

export const useSteps = () => useContext(StepsContext);
