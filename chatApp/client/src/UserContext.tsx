import React, { createContext, ReactNode, useEffect, useState } from 'react';
import axios from 'axios';
type UserContextType = {
  loggedInUser: string | null;
  setLoggedInUser: React.Dispatch<React.SetStateAction<string | null>>;
  id: string | null;
  setId: React.Dispatch<React.SetStateAction<string | null>>;
};

const UserContextState = {
  loggedInUser: null,
  setLoggedInUser: () => {},
  id: null,
  setId: () => {}
};

export const UserContext = createContext<UserContextType>(UserContextState);

interface Props {
  children: ReactNode;
}

export function UserContextProvider({ children }: Props) {
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    axios.get('/profile').then((response) => {
      setId(response.data.userId);
      setLoggedInUser(response.data.username);
    });
  }, []);

  return (
    <UserContext.Provider value={{ loggedInUser, setLoggedInUser, id, setId }}>
      {children}
    </UserContext.Provider>
  );
}
