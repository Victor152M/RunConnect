import Navbar from "@/components/Navbar";
import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import { FriendsProvider } from "../context/FriendsContext";
import { StepsProvider } from "../context/StepsContext";

export default function RootLayout() {
  return (
    <StepsProvider>
      <FriendsProvider>
        <View style={styles.container}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="map" />
            <Stack.Screen name="friends" />
          </Stack>
          <Navbar />
        </View>
      </FriendsProvider>
    </StepsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
  },
});
