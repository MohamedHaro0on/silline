import { createContext, useContext, useEffect, useState } from "react";
import React from "react";

import MenueContext from "./menue";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const OrdersContext = createContext([]);

export const OrdersContextProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const { menue } = useContext(MenueContext);
  const [prevOrders, setPrevOrders] = useState([]);
  const navigate = new useNavigate();

  useEffect(() => {
    let price = 0;
    orders &&
      orders.forEach((element) => {
        price += element.Price * element.quantity;
      });
    setTotalPrice(price);
  }, [orders]);

  useEffect(() => {
    getPrevOrders();
  }, []);

  const ordersHandler = (id) => {
    console.log(id);
    // loading the data set ;
    const item = menue.filter((d) => d.AdminItemID === id);
    console.log(item);
    // making a copy of orders ;
    item[0].quantity = 1;
    let temp = orders.map((el) => el);

    // getting repeated orders ;
    let repeated = temp.filter((e) => e.AdminItemID === id);

    // check if there are repeated orders ;
    if (repeated.length > 0) {
      temp = temp.filter((elem) => elem.AdminItemID !== id);
      setOrders(temp);
    } else {
      // adding the new item ;
      temp.push(item[0]);
      setOrders(temp);
    }
  };

  const deCreamentQuantity = (id) => {
    let temp = orders.map((el) => el);
    const index = temp.findIndex((el) => el.AdminItemID === id);
    if (temp[index].quantity > 1) {
      temp[index].quantity--;
    } else {
      temp = temp.filter((el) => el.AdminItemID !== id);
    }
    setOrders(temp);
  };

  const inCreamentQuantity = (id) => {
    let temp = orders.map((el) => el);
    const index = temp.findIndex((el) => el.AdminItemID === id);
    temp[index].quantity++;
    setOrders(temp);
  };

  const submitOrder = ({ takeAway }) => {
    const orderDate = new Date();
    axios
      .post("/createOrder_Api.php", {
        OrderNumber: prevOrders.length,
        OrderDate: `${orderDate.getFullYear()}-${
          orderDate.getMonth() + 1
        }-${orderDate.getDate()}`,
        Status: "Pending",
        TotalAmount: totalPrice,
        menuItemID: JSON.stringify(orders.map((el) => el.AdminItemID)),
        quantity: JSON.stringify(orders.map((el) => el.quantity)),
        take_away: takeAway,
      })
      .then((res) => {
        toast.success("We Got your Order !!! " , {
          position : toast.POSITION.TOP_RIGHT ,
        })
        navigate("/hall");
      })
      .catch((err) => {
        toast.error("There were an error while placing your order " , {
          position : toast.POSITION.TOP_RIGHT ,
        })      });
  };

  const getPrevOrders = () => {
    axios
      .get("/GetAllOrder.php")
      .then((res) => {
       setPrevOrders(res.data);
        // return res.data ; 
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <OrdersContext.Provider
      value={{
        deCreamentQuantity,
        inCreamentQuantity,
        ordersHandler,
        orders,
        totalPrice,
        submitOrder,
        prevOrders , 
        getPrevOrders
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};
export default OrdersContext;
