import React from "react";
import ReactDOM from "react-dom";
import { ToastContainer } from "react-toastify";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import CheckSignInProvider from "./contexts/CheckSignInProvider";
import { Web3ReactProvider } from "@web3-react/core";

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={(library) => library}>
      <CheckSignInProvider>
        <App />
        <ToastContainer />
      </CheckSignInProvider>
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
