import { ActivityIndicator, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import useLocation from '../hooks/useLocation';

export default function OSMMapWebView() {
  const { location, loading, error } = useLocation();

  // Show loading while getting location
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#08e6ff" />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  // Show error if permission denied or other error
  if (error || !location) {
    const latitude = 44.4268; // Fallback to Bucharest
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
          }
        </script>
      </body>
      </html>
    `;

    return (
      <SafeAreaProvider>
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

  // Render map with user location
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
        }
      </script>
    </body>
    </html>
  `;

  return (
    <SafeAreaProvider>
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