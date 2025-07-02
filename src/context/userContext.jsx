import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

export default function UsersProvider({ children }) {
  const [globalUserId, setGlobalUserId] = useState(null);
  const [selectedChallengeId, setSelectedChallengeId] = useState(null);
 
  // Load globalUserId from localStorage on mount
  useEffect(() => {
    const storedUserId = localStorage.getItem("globalUserId");
    if (storedUserId) {
      setGlobalUserId(storedUserId);
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        globalUserId,
        setGlobalUserId,
        selectedChallengeId,
        setSelectedChallengeId,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

