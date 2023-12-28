import { createContext, useContext, useEffect, useState } from "react";
import React from "react";

import MenueContext from "./menue";
import axios from "axios";
import { json, useNavigate } from "react-router-dom";

const OrdersContext = createContext([]);

export const OrdersContextProvider = ({ children }) => {
  const { menue } = useContext(MenueContext);

  const [order, setOrder] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [open, setOpen] = useState(false);
  const [previousOrders, setPreviousOrders] = useState([]);
  const [orderNumber, setOrderNumber] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adjustmentModal, setAdjustmentModal] = useState(false);
  const [takeAway, setTakeAway] = useState(false);
  const [paymentStatus , setPaymentStatus] = useState(null)
  const history = useNavigate();

  useEffect(() => {
    getPreviousOrders();
  }, []);

  const getPreviousOrders = () => {
    axios
      .get("/GetAllOrder.php")
      .then((res) => {
        if (res.data.status === 0) {
          setPreviousOrders([]);
        } else {
          setPreviousOrders(res.data);
        }
      })
      .catch((err) => {});
  };

  useEffect(() => {
    let price = 0;
    order &&
      order.forEach((element) => {
        if (element.addOnPrice) {
          price +=
            (parseInt(element.Price) + parseInt(element.addOnPrice)) *
            parseInt(element.quantity);
        } else {
          price += parseInt(element.Price) * parseInt(element.quantity);
        }
      });
    setTotalPrice(price);
  }, [order]);

  const ordersHandler = (id) => {
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

  const getPaymentURL = () => {
    setLoading(true)
    axios
      .post("https://silinbakeri.net/php/payment/Pay.php", {
        TotalAmount: totalPrice,
      })
      .then((res) => {
        localStorage.setItem("order", JSON.stringify(order));
        localStorage.setItem("orderID", JSON.stringify(res.data.order_id));
        localStorage.setItem("takeAway", JSON.stringify(takeAway));

        setOrder([]);
        setLoading(false)
        window.open(res.data.payment_url, "_blank");
      })
      .catch((err) => {
      });
  };
  const submitOrder = () => {
    setLoading(true);
    const savedOrder = JSON.parse(localStorage.getItem("order"));
    const savedOrderId = JSON.parse(localStorage.getItem("orderID"));
    const savedTakeAway = JSON.parse(localStorage.getItem("takeAway"));




    if (savedOrder && savedOrder.length > 0 && savedOrderId) {
      let orderNumber = previousOrders.length + 1;
      const orderDate = new Date();

      
      const allAdjustments = savedOrder.map((el, index) => {
        if (el.adjustments) {
          return el.adjustments
            .map((ob) => `${ob.title} : ${ob.adj.label}`)
            .concat(
              savedOrder[index].sideDishes &&
                savedOrder[index].sideDishes.map(
                  (sideDish) => sideDish.ItemName
                )
            );
        } else {
          return [];
        }
      });
      axios
        .post("https://silinbakeri.net/php/payment/insertOrder.php", {
          OrderNumber: orderNumber,
          orderIdVipps: savedOrderId,
          OrderDate: `${orderDate.getFullYear()}-${
            orderDate.getMonth() + 1
          }-${orderDate.getDate()}  ${orderDate.getHours()%12}:${orderDate.getMinutes()}:${orderDate.getSeconds()}`,
          Status: 1,
          TotalAmount: totalPrice,
          menuItemID: JSON.stringify(savedOrder.map((el) => el.MenuItemID)),
          quantity: JSON.stringify(savedOrder.map((el) => el.quantity)),
          take_away: savedTakeAway === true ? 1 : 0 ,
          ItemName: JSON.stringify(savedOrder.map((el) => el.ItemName)),
          adjustments: JSON.stringify(allAdjustments),
        })
        .then((res) => {
          setOrderNumber(orderNumber);
          setPaymentStatus(res.data.payment_status);
          setLoading(false);
        })
        .catch((err) => {
          
        });
    } else {
      history("/");
    }
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  // handleChange for the side Dishes ;
  const handleSideDishes = (item, sideDish) => {
    let temp = order.map((el) => el); //
    const index = temp.findIndex((x) => x.MenuItemID === item.MenuItemID);
    const orderItem = temp[index];

    if (!orderItem.addOnPrice) {
      orderItem.addOnPrice = 0;
    }

    if (!orderItem.sideDishes) {
      orderItem.sideDishes = [];
      orderItem.sideDishes.push(sideDish);
    } else {
      orderItem.sideDishes.forEach((sideDishes) => {
        orderItem.addOnPrice -= Number(sideDishes.Price);
      });

      let repeated = orderItem.sideDishes.filter(
        (element) => element.ItemName === sideDish.ItemName
      );
      if (repeated.length > 0) {
        orderItem.sideDishes = orderItem.sideDishes.filter(
          (element) => element.ItemName !== sideDish.ItemName
        );
      } else {
        orderItem.sideDishes.push(sideDish);
      }
    }

    orderItem.sideDishes.forEach((sideDish) => {
      orderItem.addOnPrice += Number(sideDish.Price);
    });

    setOrder(temp);
  };

  // handle Change for Other Adjustments ;
  const handleOrderAdjustments = (adj, title, item) => {
    let temp = order.map((el) => el); //
    const index = temp.findIndex((x) => x.MenuItemID === item.MenuItemID);

    const orderItem = temp[index];

    if (!order.addOnPrice) {
      orderItem.addOnPrice = 0;
    } else {
      orderItem.adjustments.forEach((adjustement) => {
        orderItem.addOnPrice -= Number(adjustement.adj.price);
      });
    }

    if (!orderItem.adjustments) {
      orderItem.adjustments = [];
      orderItem.adjustments.push({ title, adj });
    } else {
      let repeated = orderItem.adjustments.filter(
        (element) => element.title === title
      );
      if (repeated.length > 0) {
        let adjustmentIndex = orderItem.adjustments.findIndex(
          (element) => element.title === title
        );
        orderItem.adjustments.splice(adjustmentIndex, 1);
        orderItem.adjustments.push({ title, adj });
      } else {
        orderItem.adjustments.push({ title, adj });
      }
    }

    orderItem.adjustments.forEach((adjustement) => {
      orderItem.addOnPrice += Number(adjustement.adj.price);
    });
    setOrder(temp);
  };

  // Reseting Adjustments and  side Dishes ;
  const handleAdjustmentsReset = (item) => {
    const temp = order.map((el) => el);
    const index = temp.indexOf((ord) => ord.itemName === item.Name);
    const orderItem = order[index];
    orderItem.adjustments = [];
    orderItem.sideDishes = [];
    orderItem.addOnPrice = 0;

    setOrder(temp);
  };

  const cancelOrder = () => {
    setOrder([]);
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
        handleOpen,
        orderNumber,
        loading,
        adjustmentModal,
        setAdjustmentModal,
        handleSideDishes,
        handleOrderAdjustments,
        handleAdjustmentsReset,
        getPaymentURL,
        takeAway,
        setTakeAway,
        cancelOrder,
        paymentStatus,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};
export default OrdersContext;
