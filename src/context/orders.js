import { createContext, useContext, useEffect, useState } from "react";
import React from "react";

import MenueContext from "./menue";
import axios from "axios";
import { toast } from "react-toastify";

const OrdersContext = createContext([]);

export const OrdersContextProvider = ({ children }) => {
  const { getMenue, menue } = useContext(MenueContext);

  const [order, setOrder] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [open, setOpen] = useState(false);
  const [previousOrders, setPreviousOrders] = useState([]);
  const [orderNumber, setOrderNumber] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adjustmentModal, setAdjustmentModal] = useState(false);

  useEffect(() => {
    getPreviousOrders();
  }, []);

  const getPreviousOrders = () => {
    axios
      .get("/GetAllOrder.php")
      .then((res) => {
        console.log(res.data);
        setPreviousOrders(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    let price = 0;
    order &&
      order.forEach((element) => {
        price += element.Price * element.quantity;
      });
    setTotalPrice(price);
  }, [order]);

  const ordersHandler = (id) => {
    console.log(id);
    // loading the data set ;
    const item = menue.filter((d) => d.MenuItemID === id);
    // making a copy of orders ;
    item[0].quantity = 1;
    let temp = order.map((el) => el);

    // getting repeated orders ;
    let repeated = temp.filter((e) => e.MenuItemID === id);

    // check if there are repeated orders ;
    if (repeated.length > 0) {
      temp = temp.filter((elem) => elem.MenuItemID !== id);
      setOrder(temp);
    } else {
      // adding the new item ;
      temp.push(item[0]);
      setOrder(temp);
      setAdjustmentModal(true);
    }
  };

  const deCreamentQuantity = (id) => {
    let temp = order.map((el) => el);
    const index = temp.findIndex((el) => el.MenuItemID === id);
    if (temp[index].quantity > 1) {
      temp[index].quantity--;
    } else {
      temp = temp.filter((el) => el.MenuItemID !== id);
    }
    setOrder(temp);
  };

  const inCreamentQuantity = (id) => {
    let temp = order.map((el) => el);
    const index = temp.findIndex((el) => el.MenuItemID === id);
    temp[index].quantity++;
    setOrder(temp);
  };

  const submitOrder = ({ takeAway }) => {
    setLoading(true);
    const orderDate = new Date();
    let orderNumber = previousOrders.length + 1;
    axios
      .post("/createOrder_Api.php", {
        OrderNumber : orderNumber  ,
        OrderDate: `${orderDate.getFullYear()}-${
          orderDate.getMonth() + 1
        }-${orderDate.getDate()}`,
        Status: "Pending",
        TotalAmount: totalPrice,
        menuItemID: JSON.stringify(order.map((el) => el.MenuItemID)),
        quantity: JSON.stringify(order.map((el) => el.quantity)),
        take_away: takeAway,
      })
      .then((res) => {
        setOpen(true);
        setOrderNumber(orderNumber);
        setLoading(false);
        getPreviousOrders();
        getMenue();
        setOrder([]);
        setLoading(false);

      })
      .catch((err) => {
        toast.error("There were an error while placing your order ", {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };

  const handleClose = () => {
    setOpen((prevState) => !prevState);
  };
  return (
    <OrdersContext.Provider
      value={{
        deCreamentQuantity,
        inCreamentQuantity,
        ordersHandler,
        order,
        totalPrice,
        submitOrder,
        handleClose,
        open,
        orderNumber,
        loading,
        adjustmentModal,
        setAdjustmentModal,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};
export default OrdersContext;
