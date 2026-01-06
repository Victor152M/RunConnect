import { createContext, useContext, useState } from 'react';

const FriendsContext = createContext();

export function FriendsProvider({ children }) {
  const [myName, setMyName] = useState('');
  const [friends, setFriends] = useState([]); // array of names

  const addFriend = (name) => {
    if (!friends.includes(name)) {
      setFriends([...friends, name]);
    }
  };

  return (
    <FriendsContext.Provider value={{
      myName,
      setMyName,
      friends,
      addFriend
    }}>
      {children}
    </FriendsContext.Provider>
  );
}

export const useFriends = () => useContext(FriendsContext);
