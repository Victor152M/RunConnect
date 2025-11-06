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
          setError('Permission denied');
          setLoading(false);
          return;
        }

        const loc = await Location.getCurrentPositionAsync({
            enableHighAccuracy: false,
            timeout: 3000,
            maximumAge: 10000, 
        });
        
        setLocation(loc.coords);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    getLocation();
  }, []);

  return { location, loading, error };
}