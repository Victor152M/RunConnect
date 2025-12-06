import Navbar from "@/components/Navbar";
import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import { StepsProvider } from "../context/SteoContext"; // ← исправить путь
// если файл называется SteoContext.tsx, ПЕРЕИМЕНУЙ в StepsContext.tsx

export default function RootLayout() {
  return (
    <StepsProvider>
      <View style={styles.container}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="map" />
        </Stack>
        <Navbar />
      </View>
    </StepsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
