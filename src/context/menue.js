import axios from "axios";
import { useState, createContext, useEffect   } from "react";

export const MenueContext = createContext();

export const MenueContextProvider = ({ children }) => {
  const [menue, setMenue] = useState([]);
  
  useEffect(() => {
    axios
      .get("/SelectAllitem.php")
      .then((res) => {
        setMenue(res.data);
      })
      .catch((err) => {
      });
  }, []);
  return (
    <MenueContext.Provider value={{ menue, setMenue }}>
      {children}
    </MenueContext.Provider>
  );
};

export default MenueContext;
