import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Order from "./Order";
import { ToastContainer } from "react-toastify";


const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route index exact path="/" element={<Order />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;