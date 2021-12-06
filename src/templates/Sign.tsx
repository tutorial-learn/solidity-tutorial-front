import useSign from "../hooks/useSign";

export default function Sign() {
  const { login } = useSign();
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <button
        className="py-3 px-5 rounded-md bg-yellow-600 text-white active:bg-yellow-700 transition"
        onClick={login}
      >
        메타 마스크
      </button>
    </div>
  );
}
