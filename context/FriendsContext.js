import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

const FriendsContext = createContext(undefined);

const STORAGE_KEY = "FRIENDS_DATA";

export function FriendsProvider({ children }) {
  const [myName, setMyName] = useState("");
  const [friends, setFriends] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Load on startup
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setMyName(parsed.myName || "");
          setFriends(Array.isArray(parsed.friends) ? parsed.friends : []);
        }
      } catch (e) {
        console.error("Failed to load friends", e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  // Save on change
  useEffect(() => {
    if (!loaded) return;

    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ myName, friends })
    );
  }, [myName, friends, loaded]);

  const addFriend = (name) => {
    if (!friends.includes(name)) {
      setFriends([...friends, name]);
    }
  };

  return (
    <FriendsContext.Provider
      value={{ myName, setMyName, friends, addFriend }}
    >
      {children}
    </FriendsContext.Provider>
  );
}

export function useFriends() {
  const context = useContext(FriendsContext);
  if (!context) {
    throw new Error("useFriends must be used within a FriendsProvider");
  }
  return context;
}
