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

    let subscription: Pedometer.Subscription | null = null;

    (async () => {
      try {
        const { status } = await Pedometer.requestPermissionsAsync();
        if (status !== "granted") return;

        const available = await Pedometer.isAvailableAsync();
        if (!available) return;

        subscription = Pedometer.watchStepCount(result => {
          const sensorSteps = typeof result.steps === "number" ? result.steps : 0;

          if (lastSensorCountRef.current === null) {
            lastSensorCountRef.current = sensorSteps;
            return;
          }

          const delta = sensorSteps - lastSensorCountRef.current;
          if (delta <= 0) return;

          lastSensorCountRef.current = sensorSteps;

          setTodaySteps(prev => {
            const newTotal = prev + delta;

            setWeekSteps(prevWeek => {
              const dayIndex = new Date().getDay();
              const updatedWeek = [...prevWeek];
              updatedWeek[dayIndex] = (prevWeek[dayIndex] || 0) + delta;

              AsyncStorage.setItem("STEPS_DATA", JSON.stringify({
                today: newTotal,
                week: updatedWeek
              }));

              return updatedWeek;
            });

            return newTotal;
          });
        });

      } catch (err) {
        console.error(err);
      }
    })();

    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  return (
    <StepsContext.Provider value={{ todaySteps, weekSteps }}>
      {children}
    </StepsContext.Provider>
  );
}

export const useSteps = () => useContext(StepsContext);