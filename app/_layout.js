import Navbar from "@/components/Navbar";
import { StepsProvider } from "context/SteoContext"; // ← исправить путь
import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
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
