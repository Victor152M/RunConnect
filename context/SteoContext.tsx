import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pedometer } from "expo-sensors";
import React, { createContext, useContext, useEffect, useState } from "react";

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

  // ---- СЧИТЫВАЕМ ШАГИ ----
  useEffect(() => {
    const subscription = Pedometer.watchStepCount(async result => {
      const steps = result.steps;
      setTodaySteps(steps);

      const day = new Date().getDay(); // 0=вс, 1=пн...

      setWeekSteps(prev => {
        const updated = [...prev];
        updated[day] = steps;
        AsyncStorage.setItem("WEEK_STEPS", JSON.stringify(updated));
        return updated;
      });
    });

    return () => subscription.remove();
  }, []);

  // ---- ЗАГРУЖАЕМ ДАННЫЕ ИЗ ПАМЯТИ ----
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
