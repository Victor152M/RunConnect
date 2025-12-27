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
  weekSteps: [0,0,0,0,0,0,0],
});

type Props = {
  children: React.ReactNode;
};

export function StepsProvider({ children }: Props) {
  const [todaySteps, setTodaySteps] = useState(0);
  const [weekSteps, setWeekSteps] = useState<WeekData>([0,0,0,0,0,0,0]);

  // Track the last pedometer value to compute delta
  const lastSensorCountRef = React.useRef<number | null>(null);

  // Load saved steps on startup
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem("STEPS_DATA");
        if (saved) {
          const parsed = JSON.parse(saved);
          setTodaySteps(typeof parsed.today === "number" ? parsed.today : 0);
          setWeekSteps(Array.isArray(parsed.week) && parsed.week.length === 7 ? parsed.week : [0,0,0,0,0,0,0]);
        }
      } catch (err) {
        console.error("Failed to load steps:", err);
      }
    })();
  }, []);

  // Subscribe to pedometer
  useEffect(() => {
    if (Platform.OS !== "android") return;

    (async () => {
      try {
        const { status } = await Pedometer.requestPermissionsAsync();
        if (status !== "granted") return;

        const available = await Pedometer.isAvailableAsync();
        if (!available) return;

        const subscription = Pedometer.watchStepCount(result => {
          const sensorSteps = typeof result.steps === "number" ? result.steps : 0;

          // First event: just set lastSensorCountRef
          if (lastSensorCountRef.current === null) {
            lastSensorCountRef.current = sensorSteps;
            return;
          }

          const delta = sensorSteps - lastSensorCountRef.current;
          if (delta <= 0) return;

          lastSensorCountRef.current = sensorSteps;

          // Add delta to totals
          setTodaySteps(prev => {
            const newTotal = prev + delta;
            return newTotal;
          });

          setWeekSteps(prev => {
            const dayIndex = new Date().getDay();
            const updated = [...prev];
            updated[dayIndex] = (prev[dayIndex] || 0) + delta;

            // Save everything
            AsyncStorage.setItem("STEPS_DATA", JSON.stringify({
              today: todaySteps + delta,
              week: updated
            }));

            return updated;
          });
        });

        return () => subscription.remove();
      } catch (err) {
        console.error(err);
      }
    })();
  }, [todaySteps]);

  return (
    <StepsContext.Provider value={{ todaySteps, weekSteps }}>
      {children}
    </StepsContext.Provider>
  );
}

export const useSteps = () => useContext(StepsContext);