import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useCheckSignIn } from "../contexts/CheckSignInProvider";

const injected = new InjectedConnector({ supportedChainIds: [97] });

export default function useSign() {
  const { activate, deactivate } = useWeb3React();
  const { setIsLoggedIn } = useCheckSignIn();

  const login = async () => {
    localStorage.setItem("isLoggedIn", "true");
    await activate(injected, async (err: Error) => {
      localStorage.removeItem("isLoggedIn");
      setIsLoggedIn(false);
      if (err instanceof UnsupportedChainIdError) {
        // switch network
        console.log("not supported chain");
      }
    });
  };

  const logout = () => {
    deactivate();
    localStorage.removeItem("isLoggedIn");
  };

  return { login, logout };
}
