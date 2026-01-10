import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { API_KEY } from "../config";
import { useFriends } from "../context/FriendsContext";
import useLocation from '../hooks/useLocation';

export default function OSMMapWebView() {
  const { location, loading, error } = useLocation();
  const [data, setData] = useState(null);
  const { friends, myName } = useFriends();

  const backend = "https://runconnect-bddk.onrender.com"
  useEffect(() => {
    fetch(backend + "/locations", {
        headers: {
        "api-key": API_KEY,
        },
      })
      .then((resp) => resp.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.error(error);
      })
  }, []);

  useEffect(() => {
    if (!location || !myName) return;
    if (!myName.trim()) return;
    
    fetch(backend + "/upload_location", {
      method: "POST",
      headers:{
        "Content-type": "application/json",
        "api-key": API_KEY,
      },
      body: JSON.stringify({
        name: myName,
        lat: location.latitude,
        lng: location.longitude,
      }),
    })
      .then(res => res.json())
      .catch(err => {
        console.error("Location upload failed", err);
      });
  }, [location, myName]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#991F26" />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }


  const filteredUsers = data?.filter(u =>
      friends.includes(u.name)
  );

  const usersJS = `const users = ${JSON.stringify(filteredUsers || [])};`;

  if (error || !location) {
    const latitude = 44.4268;
    const longitude = 26.1025;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OSM Map</title>
        <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/>
        <style>
          html, body, #map { height: 100%; margin: 0; padding: 0; }
          .leaflet-top.leaflet-left {
            top: 40px !important;
          }
          .leaflet-bottom.leaflet-right {
            bottom: 80px !important;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
        <script>
          window.onload = function() {
            const map = L.map('map').setView([${latitude}, ${longitude}], 13);
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
              maxZoom: 19,
            }).addTo(map);

            ${usersJS}

            users.forEach(u => {
              L.marker([u.lat, u.lng])
                .addTo(map)
                .bindPopup(u.name);
            });
          }
        </script>
      </body>
      </html>
    `;

    return (
      <SafeAreaProvider>
        <ScrollView style={{ padding: 20 }}>
          <Text>{data ? JSON.stringify(data, null, 2) : "Loading..."}</Text>
        </ScrollView>
        <StatusBar barStyle="dark-content" translucent={false} />
        <View style={styles.container}>
          <WebView
            originWhitelist={['*']}
            source={{ html }}
            style={styles.webview}
            userAgent="RunConnect/1.0"
          />
        </View>
      </SafeAreaProvider>
    );
  }

  const latitude = location.latitude;
  const longitude = location.longitude;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OSM Map</title>
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/>
      <style>
        html, body, #map { height: 100%; margin: 0; padding: 0; }
        .leaflet-top.leaflet-left {
          top: 40px !important;
        }
        .leaflet-bottom.leaflet-right {
          bottom: 80px !important;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
      <script>
        window.onload = function() {
          const map = L.map('map').setView([${latitude}, ${longitude}], 15);
          L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
          }).addTo(map);
          L.marker([${latitude}, ${longitude}]).addTo(map)
            .bindPopup('You are here!')
            .openPopup();

          ${usersJS}

          users.forEach(u => {
            const minutesAgo = Math.floor(u.last_seen_seconds / 60);

            L.marker([u.lat, u.lng])
              .addTo(map)
              .bindPopup(u.name + "<br/>Last seen: " + minutesAgo + " minutes ago");
          });
        }
      </script>
    </body>
    </html>
  `;

  return (
    <SafeAreaProvider>
      {/*
      <ScrollView style={{ padding: 20 }}>
        <Text>{data ? JSON.stringify(data, null, 2) : "Loading..."}</Text>
      </ScrollView>
      */}
      <StatusBar barStyle="dark-content" translucent={false} />
      <View style={styles.container}>
        <WebView
          originWhitelist={['*']}
          source={{ html }}
          style={styles.webview}
          userAgent="RunConnect/1.0"
        />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webview: { flex: 1 },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});