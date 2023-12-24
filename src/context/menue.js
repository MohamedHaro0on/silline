import axios from "axios";
import { useState, createContext, useEffect } from "react";
import API from "../apiEndPoint";

export const MenueContext = createContext();

export const MenueContextProvider = ({ children }) => {
  const [menue, setMenue] = useState([]);

  useEffect(() => {
    getMenue();
  }, []);
  const getMenue = () => {
    axios
      .get(`${API}/SelectALLitemMenu.php`)
      .then((res) => {
        console.log(res.data);
        setMenue(res.data);
      })
      .catch((err) => {});
  };
  return (
    <MenueContext.Provider value={{ menue, setMenue, getMenue }}>
      {children}
    </MenueContext.Provider>
  );
};

export default MenueContext;
