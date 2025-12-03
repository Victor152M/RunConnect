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
  // Обёртка в async, чтобы можно было использовать await
  (async () => {
    // Запрашиваем разрешение на шагомер
    const { status } = await Pedometer.requestPermissionsAsync();
    if (status !== 'granted') {
      console.log('Разрешение на шагомер не получено');
      return; // прекращаем работу, если разрешение не дали
    }

    // Проверяем, доступен ли шагомер на устройстве
    const available = await Pedometer.isAvailableAsync();
    if (!available) {
      console.log('Шагомер недоступен на этом устройстве');
      return;
    }

    // Подписка на шаги
    const subscription = Pedometer.watchStepCount(result => {
      const steps = result.steps;
      setTodaySteps(steps);

      const day = new Date().getDay();
      setWeekSteps(prev => {
        const updated = [...prev];
        updated[day] = steps;
        AsyncStorage.setItem("WEEK_STEPS", JSON.stringify(updated));
        return updated;
      });
    });

    // Чистим подписку при размонтировании
    return () => subscription.remove();
  })();
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
