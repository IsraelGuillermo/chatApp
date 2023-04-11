import React, { createContext, ReactNode, useState } from 'react';

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

  return (
    <UserContext.Provider value={{ loggedInUser, setLoggedInUser, id, setId }}>
      {children}
    </UserContext.Provider>
  );
}
