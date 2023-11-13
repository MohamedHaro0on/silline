import { createContext, useContext, useEffect, useState } from "react";
import React from "react";

import MenueContext from "./menue";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CleaningServices } from "@mui/icons-material";

const OrdersContext = createContext([]);

export const OrdersContextProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [open, setOpen] = useState(false);
  const [prevOrders, setPrevOrders] = useState([]);
  const [orderNumber, setOrderNumber] = useState(null);
  const [loading, setLoading] = useState(false);
  const { getMenue, menue } = useContext(MenueContext);

  useEffect(() => {
    getPrevOrders();
  }, []);

  const getPrevOrders = () => {
    axios
      .get("/GetAllOrder.php")
      .then((res) => {
        setPrevOrders(res.data);
        // return res.data ; 
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    let price = 0;
    orders &&
      orders.forEach((element) => {
        price += element.Price * element.quantity;
      });
    setTotalPrice(price);
  }, [orders]);


  const ordersHandler = (id) => {
    console.log(id);
    // loading the data set ;
    const item = menue.filter((d) => d.MenuItemID === id);
    console.log(item);
    // making a copy of orders ;
    item[0].quantity = 1;
    let temp = orders.map((el) => el);

    // getting repeated orders ;
    let repeated = temp.filter((e) => e.MenuItemID === id);

    // check if there are repeated orders ;
    if (repeated.length > 0) {
      temp = temp.filter((elem) => elem.MenuItemID !== id);
      setOrders(temp);
    } else {
      // adding the new item ;
      temp.push(item[0]);
      setOrders(temp);
    }
  };

  const deCreamentQuantity = (id) => {
    let temp = orders.map((el) => el);
    const index = temp.findIndex((el) => el.MenuItemID === id);
    if (temp[index].quantity > 1) {
      temp[index].quantity--;
    } else {
      temp = temp.filter((el) => el.MenuItemID !== id);
    }
    setOrders(temp);
  };

  const inCreamentQuantity = (id) => {
    let temp = orders.map((el) => el);
    const index = temp.findIndex((el) => el.MenuItemID === id);
    temp[index].quantity++;
    setOrders(temp);
  };

  const submitOrder = ({ takeAway }) => {
    setLoading(true);
    const orderDate = new Date();
    let Number = prevOrders.length + 1;
    console.log(Number);
    axios
      .post("/createOrder_Api.php", {
        OrderNumber: Number,
        OrderDate: `${orderDate.getFullYear()}-${orderDate.getMonth() + 1
          }-${orderDate.getDate()}`,
        Status: "Pending",
        TotalAmount: totalPrice,
        menuItemID: JSON.stringify(orders.map((el) => el.MenuItemID)),
        quantity: JSON.stringify(orders.map((el) => el.quantity)),
        take_away: takeAway,
      })
      .then((res) => {
        setOpen(true);
        setOrderNumber(Number)
        setLoading(false);
        getPrevOrders();
        getMenue();
        setOrders([]);
      })
      .catch((err) => {
        toast.error("There were an error while placing your order ", {
          position: toast.POSITION.TOP_RIGHT,
        })
      });
    setLoading(false);

  };

  const handleClose = () => {
    setOpen(prevState => !prevState);
  }
  return (
    <OrdersContext.Provider
      value={{
        deCreamentQuantity,
        inCreamentQuantity,
        ordersHandler,
        orders,
        totalPrice,
        submitOrder,
        handleClose,
        open,
        orderNumber,
        loading
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};
export default OrdersContext;