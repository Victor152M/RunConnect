// hooks/useLocation.js
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

export default function useLocation() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Location Permission',
            'Location permission is required to show your current location.'
          );
          setLoading(false);
          return;
        }

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });

        setLocation(loc.coords);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getLocation();
  }, []);

  return { location, loading, error };
}
