import { useState } from "react";
import { toBN } from "web3-utils";
import useContract, { TOKEN_ADDRESS } from "../hooks/useContract";
import useInput from "../hooks/useInput";
import { TodosS } from "./Todo";

export default function ListItem(todo: { isApprove: boolean } & TodosS) {
  const { contract, account } = useContract();
  const editInput = useInput();
  const [editting, setEditting] = useState<boolean>(false);

  const onToggleFinish = (id: string) => {
    contract.methods.toggleFinish(toBN(id)).send({ from: account });
  };

  const onEdit = (id?: string) => {
    if (!id) {
      setEditting(true);
    } else {
      if (editInput.value === "") return;
      contract.methods.edit(toBN(id), editInput.value).send({ from: account });
      editInput.setValue("");
      setEditting(false);
    }
  };

  const onCloseInput = () => {
    setEditting(false);
  };

  const onRemove = (id: string) => {
    if (!todo.isApprove) return;
    contract.methods.remove(TOKEN_ADDRESS, toBN(id)).send({ from: account });
  };

  const processedTime = (prevTime: string) => {
    const current = Date.now();
    return Math.floor((current - +prevTime * 1000) / 1000);
  };

  const recordTimeToClear = (createTime: string, clearTime: string) => {
    return Math.floor((+clearTime * 1000 - +createTime * 1000) / 1000);
  };

  return (
    <div className="flex items-center my-1">
      <button
        className="rounded-md px-2 py-1 ring-1 ring-gray-400 mr-3"
        onClick={() => onToggleFinish(todo.id)}
      >
        {todo.isFinish ? "❌" : "✅"}
      </button>
      <span
        className={`w-44 truncate inline-block ${
          todo.isFinish && "line-through"
        }`}
      >
        {`${todo.nickName}-${todo.author.slice(0, 6)}`}
      </span>
      <span className={`mx-3 relative ${todo.isFinish && "line-through"}`}>
        {editting ? (
          <>
            <input
              className="py-1 pl-3 pr-6 ring-2 ring-blue-500 rounded-md"
              onChange={editInput.onChange}
              value={editInput.value}
            />
            <button
              className="absolute right-3 top-0 bottom-0 my-auto"
              onClick={onCloseInput}
            >
              x
            </button>
          </>
        ) : (
          todo.description
        )}
      </span>
      <span className="mx-3">
        {Number(todo.finishTime) !== 0
          ? recordTimeToClear(
              Number(todo.updatedAt) !== 0 ? todo.updatedAt : todo.createdAt,
              todo.finishTime
            ) + "s"
          : Number(todo.updatedAt) !== 0
          ? processedTime(todo.updatedAt) + "s"
          : processedTime(todo.createdAt) + "s"}
      </span>
      <div className="ml-5">
        <button
          className="capitalize rounded-md bg-blue-400 text-white px-2 py-1 text-xs mr-1"
          onClick={() => onEdit(editting ? todo.id : undefined)}
        >
          {editting ? "update" : "edit"}
        </button>
        <button
          className="capitalize rounded-md bg-red-600 text-white px-2 py-1 text-xs"
          onClick={() => onRemove(todo.id)}
        >
          remove
        </button>
      </div>
    </div>
  );
}
