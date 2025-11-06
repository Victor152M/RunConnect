import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

let cachedLocation = null;

export default function useLocation() {
  const [location, setLocation] = useState(cachedLocation);
  const [loading, setLoading] = useState(true); // Start as true
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function getLocation() {
      try {
        // If we have cached, use it immediately but keep loading
        if (cachedLocation && isMounted) {
          setLocation(cachedLocation);
          setLoading(false);
          return;
        }

        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          if (isMounted) {
            setError('Permission to access location was denied');
            setLoading(false);
          }
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Low, // faster than High or Balanced
        });

        if (isMounted && currentLocation?.coords) {
          cachedLocation = currentLocation.coords;
          setLocation(currentLocation.coords);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        console.error('Location error:', err);
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    }

    getLocation();

    return () => {
      isMounted = false;
    };
  }, []);

  return { location, loading, error };
}