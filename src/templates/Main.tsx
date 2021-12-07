import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Join from "../components/Join";
import Todo from "../components/Todo";
import useContract from "../hooks/useContract";

export default function Main() {
  const [isJoin, setIsJoin] = useState(false);
  const [web3Loader, setWeb3Loader] = useState(true);
  const { contract, account } = useContract();

  const onJoin = (nickname: string) => {
    if (nickname === "") return;

    setWeb3Loader(true);
    contract.methods
      .join(nickname)
      .send({ from: account })
      .on("error", (err: Error) => {
        console.log(err);
      })
      .on("receipt", (r: any) => {
        setIsJoin(true);
        setWeb3Loader(false);
      });
  };

  const initJoined = useCallback(async () => {
    setWeb3Loader(true);
    const check = await contract.methods.isJoin().call({ from: account });
    setWeb3Loader(false);
    setIsJoin(check);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  useEffect(() => {
    initJoined();
  }, [initJoined]);

  useEffect(() => {
    contract.events.Join().on("data", (r: any) => {
      toast(`${r.returnValues[0]} join!`, {
        position: "top-center",
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (web3Loader)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="w-full h-screen flex items-center justify-center">
      {isJoin ? <Todo isJoin={isJoin} /> : <Join onJoin={onJoin} />}
    </div>
  );
}
