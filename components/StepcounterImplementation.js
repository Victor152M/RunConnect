import * as AuthSession from "expo-auth-session";
import { useState } from "react";
import { Button, Text, View } from "react-native";

// Google OAuth config
const CLIENT_ID = "YOUR_GOOGLE_OAUTH_CLIENT_ID.apps.googleusercontent.com";

const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
};

export default function App() {
  const [token, setToken] = useState(null);
  const [steps, setSteps] = useState(null);

  // Google Fit scope for reading step count
  const scopes = [
    "https://www.googleapis.com/auth/fitness.activity.read",
    "https://www.googleapis.com/auth/fitness.activity.write",
  ];

  // Start OAuth flow
  const loginWithGoogle = async () => {
    const redirectUri = AuthSession.makeRedirectUri();

    // Request user login
    const authResult = await AuthSession.startAsync({
      authUrl:
        `${discovery.authorizationEndpoint}` +
        `?client_id=${CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=code&scope=${encodeURIComponent(scopes.join(" "))}`,
    });

    if (authResult.type !== "success") return;

    // Exchange authorization code for access token
    const tokenResponse = await fetch(discovery.tokenEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body:
        `code=${authResult.params.code}` +
        `&client_id=${CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&grant_type=authorization_code`,
    });

    const tokenData = await tokenResponse.json();
    setToken(tokenData.access_token);
  };

  // Fetch today steps from Google Fit REST API
  const loadSteps = async () => {
    if (!token) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startTime = today.getTime() * 1_000; // nanoseconds
    const endTime = Date.now() * 1_000; // nanoseconds

    const body = {
      aggregateBy: [{ dataTypeName: "com.google.step_count.delta" }],
      bucketByTime: { durationMillis: 24 * 60 * 60 * 1000 },
      startTimeMillis: today.getTime(),
      endTimeMillis: Date.now(),
    };

    const response = await fetch(
      "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const json = await response.json();

    // Extract step values from buckets
    let totalSteps = 0;

    if (json.bucket) {
      json.bucket.forEach((bucket) => {
        bucket.dataset.forEach((dataset) => {
          dataset.point.forEach((p) => {
            // Each point contains step delta
            if (p.value && p.value.length > 0) {
              totalSteps += p.value[0].intVal || 0;
            }
          });
        });
      });
    }

    setSteps(totalSteps);
  };

  return (
    <View style={{ marginTop: 60, padding: 20 }}>
      <Button title="Login with Google Fit" onPress={loginWithGoogle} />

      {token && (
        <>
          <View style={{ height: 20 }} />
          <Button title="Load Steps" onPress={loadSteps} />
        </>
      )}

      {steps !== null && (
        <Text style={{ marginTop: 20, fontSize: 24 }}>
          Steps today: {steps}
        </Text>
      )}
    </View>
  );
}
