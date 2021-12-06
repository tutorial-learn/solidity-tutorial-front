import { createContext, useContext, useState } from "react";

const Context = createContext<any>(null);

export default function CheckSignInProvider({ children }: any) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Context.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </Context.Provider>
  );
}

export const useCheckSignIn = () => {
  return useContext(Context);
};
