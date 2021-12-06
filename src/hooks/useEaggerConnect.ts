import { useWeb3React } from "@web3-react/core";
import { useEffect } from "react";
import { useCheckSignIn } from "../contexts/CheckSignInProvider";
import useSign from "./useSign";

export default function useEaggerConnect() {
  const { active, chainId } = useWeb3React();
  const { setIsLoggedIn } = useCheckSignIn();
  const { login } = useSign();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!active && isLoggedIn === "true") {
      login();
    }
    if (active && isLoggedIn === "true") {
      setIsLoggedIn(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, chainId]);
}
