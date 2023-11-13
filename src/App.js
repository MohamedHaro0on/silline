import "./App.css";
import axios from "axios";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./homePage";
import { ToastContainer } from "react-toastify";
axios.defaults.baseURL = "https://silinbakeri.net//php";

const App = () => {
  return (
    <BrowserRouter>
          <Routes>
            <Route index exact path="/" element={<HomePage />} />
          </Routes>
          <ToastContainer/>
    </BrowserRouter>
  );
};

export default App;