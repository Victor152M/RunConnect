import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import useLocation from '../hooks/useLocation';


export default function OSMMapWebView() {
  const { location, loading } = useLocation();

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const latitude = location?.latitude ?? 44.4268;
  const longitude = location?.longitude ?? 26.1025;

  // Inject dynamic coordinates into HTML
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
        top: 40px !important; /* adjust as needed */
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
  container: { flex: 1},
  webview: { flex: 1},
});
