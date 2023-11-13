/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import React from "react";

const CategoriesContext = createContext([]);

export const CategroiesContextProvider = ({ children }) => {
  const [cat, setCat] = useState("all");
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    axios
      .get("/selectAllCategory.php")
      .then((res) => {
        console.log(res.data);
        setCategories(res.data);
      })
      .catch((err) => {});
  }, []);

  return (
    <CategoriesContext.Provider value={{ cat, setCat, categories }}>
      {children}
    </CategoriesContext.Provider>
  );
};

export default CategoriesContext;