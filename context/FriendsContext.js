import { createContext, useContext, useState } from "react";

const FriendsContext = createContext(undefined);

export function FriendsProvider({ children }) {
  const [myName, setMyName] = useState("");
  const [friends, setFriends] = useState([]);

  const addFriend = (name) => {
    if (!friends.includes(name)) {
      setFriends([...friends, name]);
    }
  };

  return (
    <FriendsContext.Provider
      value={{
        myName,
        setMyName,
        friends,
        addFriend,
      }}
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
