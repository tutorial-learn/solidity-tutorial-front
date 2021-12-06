import { ChangeEvent, useState } from "react";

export default function useInput() {
  const [value, setValue] = useState("");

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setValue(value);
  };

  return { value, onChange, setValue };
}
