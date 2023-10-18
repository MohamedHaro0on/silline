import "./App.css";
import axios from "axios";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./homePage";
import Hall from "./hall";
import Kitchen from "./kitchen";
import { OrdersContextProvider } from "./context/orders";
import { Grid } from "@mui/material";
import { ToastContainer } from "react-toastify";
axios.defaults.baseURL = "http://localhost:8080//php";

const App = () => {
  return (
    <BrowserRouter>
      <OrdersContextProvider>
        <Grid container>
          <Routes>
            <Route index exact path="/" element={<HomePage />} />
            <Route exact path="/kitchen" element={<Kitchen />} />
            <Route exact path="/hall" element={<Hall />} />
          </Routes>
        </Grid>
      </OrdersContextProvider>
    </BrowserRouter>
  );
};

export default App;
