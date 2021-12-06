import { useEffect, useState } from "react";
import { toWei, fromWei } from "web3-utils";
import { ethers } from "ethers";
import useChangePerceive from "../hooks/useChangePerceive";
import useContract, {
  CONTRACT_ADDRESS,
  TOKEN_ADDRESS,
} from "../hooks/useContract";
import useInput from "../hooks/useInput";
import ListItem from "./ListItem";
import { toast } from "react-toastify";

export interface TodosS {
  id: string;
  author: string;
  nickName: string;
  description: string;
  isFinish: boolean;
  createdAt: string;
  updatedAt: string;
  finishTime: string;
}

export default function Todo() {
  const { contract, tokenContract, account } = useContract();
  const masterInput = useInput();
  const mainInput = useInput();
  const depositInput = useInput();
  const mintAmountInput = useInput();
  const mintToInput = useInput();
  const [todos, setTodos] = useState<TodosS[]>([]);
  const [balance, setBalance] = useState(0);
  const [isMaster, setIsMaster] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isApprove, setIsApprove] = useState(false);
  const { trigger } = useChangePerceive();

  const getTodos = async () => {
    const data = await contract.methods.readAll().call();
    const balanceOf = await tokenContract.methods.balanceOf(account).call();
    setTodos(data);
    setBalance(+fromWei(balanceOf, "ether"));
  };

  const onUpload = () => {
    if (
      mainInput.value === "" ||
      Number(depositInput.value) <= 0 ||
      Number(depositInput.value) > balance ||
      !isApprove
    )
      return;

    contract.methods
      .write(TOKEN_ADDRESS, toWei(depositInput.value, "ether"), mainInput.value)
      .send({ from: account });
    mainInput.setValue("");
    depositInput.setValue("");
  };

  const onMint = () => {
    if (Number(mintAmountInput.value) <= 0 || !isOwner) return;
    tokenContract.methods
      .mint(mintToInput.value, toWei(mintAmountInput.value, "ether"))
      .send({ from: account });
  };

  const getPermission = async () => {
    const checkOfMaster = await contract.methods
      .isMaster()
      .call({ from: account });
    const checkOfOwner = await contract.methods
      .isOwner()
      .call({ from: account });
    setIsMaster(checkOfMaster);
    setIsOwner(checkOfOwner);
  };

  const setPermission = (type: "set" | "unset") => {
    contract.methods[type === "set" ? "setMaster" : "unsetMaster"](
      masterInput.value
    ).send({ from: account });
  };

  const onOut = () => {
    contract.methods.out().send({ from: account });
  };

  const onApprove = () => {
    if (isApprove) return;
    tokenContract.methods
      .approve(CONTRACT_ADDRESS, ethers.constants.MaxUint256)
      .send({ from: account })
      .once("receipt", () => {
        toast("Approve successed", {
          type: "success",
          position: "bottom-left",
        });
        setIsApprove(true);
      })
      .once("error", (err: Error) => {
        toast(err.message, { type: "error", position: "bottom-left" });
        setIsApprove(false);
      });
  };

  useEffect(() => {
    getPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center relative">
      {!isOwner && (
        <button
          className="absolute top-2 left-2 capitalize rounded-md bg-indigo-400 text-white py-1 px-3 text-sm"
          onClick={onOut}
        >
          out
        </button>
      )}
      {isOwner && (
        <div className="absolute top-0 right-0 ring-2 ring-green-200 p-3 divide-y divide-solid divide-gray-600">
          <div className="flex flex-col items-center justify-center p-2">
            <input
              onChange={masterInput.onChange}
              value={masterInput.value}
              placeholder="permission to address"
              className="text-sm py-1 px-3 ring-1 ring-gray-400"
            />
            <div className="flex space-x-2 mt-2">
              <button
                className="py-1 px-3 bg-green-400 rounded-md text-white"
                onClick={() => setPermission("set")}
              >
                set
              </button>
              <button
                className="py-1 px-3 bg-yellow-400 rounded-md text-white"
                onClick={() => setPermission("unset")}
              >
                unset
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center p-2">
            <input
              onChange={mintToInput.onChange}
              value={mintToInput.value}
              placeholder="user address"
              className="text-sm py-1 px-3 ring-1 ring-gray-400 mt-3"
            />
            <input
              onChange={mintAmountInput.onChange}
              value={mintAmountInput.value}
              type="number"
              placeholder="amount"
              className="text-sm py-1 px-3 ring-1 ring-gray-400 mt-3"
            />
            <div className="flex space-x-2 mt-2">
              <button
                className="py-1 px-3 bg-green-400 rounded-md text-white"
                onClick={onMint}
              >
                mint
              </button>
            </div>
          </div>
        </div>
      )}
      <h1 className="text-lg font-bold mb-3">
        Are you master? {`${isMaster && "true / pemission: 'remove'"}`}
      </h1>
      <div className="flex">
        <div className="flex flex-col justify-center">
          <input
            placeholder="Type your plan"
            value={mainInput.value}
            onChange={mainInput.onChange}
            className="py-1 px-5 ring-2 ring-blue-500 rounded-md mb-2"
          />
          {isApprove ? (
            <input
              type="number"
              placeholder={`amount (max: ${balance})`}
              onChange={depositInput.onChange}
              value={depositInput.value}
              className="py-1 px-5 ring-2 ring-blue-500 rounded-md"
            />
          ) : (
            <button
              className="capitalize py-1 px-5 bg-blue-400 rounded-md text-white"
              onClick={onApprove}
            >
              approve
            </button>
          )}
        </div>
        <button
          className="py-1 px-2 rounded-md bg-blue-400 text-white ml-2"
          onClick={onUpload}
        >
          업로드
        </button>
      </div>
      <div className="w-5/12 ring-1 my-5"></div>
      {todos.map((todo) => {
        return <ListItem key={todo.id} {...todo} isApprove={isApprove} />;
      })}
    </div>
  );
}
