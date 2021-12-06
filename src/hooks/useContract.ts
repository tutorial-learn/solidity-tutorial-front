import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";

import todoABI from "../abi/todoABI";
import tokenABI from "../abi/tokenABI";

export const CONTRACT_ADDRESS = process.env.REACT_APP_TODO_ADDRESS;
export const TOKEN_ADDRESS = process.env.REACT_APP_TODO_TOKEN;

export default function useContract() {
  const { account, library } = useWeb3React();
  const web3 = new Web3(library);
  const contract = new web3.eth.Contract(todoABI, CONTRACT_ADDRESS);
  const tokenContract = new web3.eth.Contract(tokenABI, TOKEN_ADDRESS);

  return { contract, tokenContract, account };
}
