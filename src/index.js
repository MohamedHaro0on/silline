import React from "react";
import ReactDOM from "react-dom";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "react-toastify/dist/ReactToastify.css";

import "./index.css";
import App from "./App";
import AllContextsProvider from "./context/allContexts";

ReactDOM.hydrate(
  <React.StrictMode>
    <AllContextsProvider>
      <App />
    </AllContextsProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
