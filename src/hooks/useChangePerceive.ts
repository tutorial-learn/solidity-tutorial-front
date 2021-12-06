import { useEffect, useState } from "react";
import useContract from "./useContract";

export default function useChangePerceive() {
  const { contract } = useContract();
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    contract.events.Change().on("data", () => {
      setTrigger((prev) => prev + 1);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { trigger };
}
