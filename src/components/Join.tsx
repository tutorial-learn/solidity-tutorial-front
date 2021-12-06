import useInput from "../hooks/useInput";

interface Props {
  onJoin: (nickname: string) => void;
}

export default function Join({ onJoin }: Props) {
  const nickNameInput = useInput();

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <input
        className="ring-1 ring-gray-500 py-2 px-4 rounded-md"
        onChange={nickNameInput.onChange}
        value={nickNameInput.value}
        placeholder="nickname"
      />
      <button
        className="rounded-md px-6 py-3 bg-green-600 text-white capitalize"
        onClick={() => onJoin(nickNameInput.value)}
      >
        join
      </button>
    </div>
  );
}
