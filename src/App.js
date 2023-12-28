import "./App.css";
import axios from "axios";
import { BrowserRouter, Route, Routes, Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import HomePage from "./homePage";
import OrderStatus from "./orderStatus";

axios.defaults.baseURL = "https://silinbakeri.net//php";

const App = () => {
  return (
    <>
      <Routes>
        <Route index exact path="/" element={<HomePage />} />
        <Route exact path="/order-status" element={<OrderStatus />} />
      </Routes>
      <ToastContainer />
    </>
  );
};

export default App;
