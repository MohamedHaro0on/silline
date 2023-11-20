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
        setPreviousOrders(res.data);
      })
      .catch((err) => {
      });
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

  const submitOrder = ({ takeAway }) => {
    setLoading(true);
    const orderDate = new Date();
    let orderNumber = previousOrders.length + 1;
    const allAdjustments = order.map((el, index) => {
      if (el.adjustments) {
        return el.adjustments
          .map((ob) => `${ob.title}  ${ob.adj.label}`)
          .concat(
            order[index].sideDishes &&
              order[index].sideDishes.map((sideDish) => sideDish.ItemName)
          );
      }
      else {
        return [];
      }
    });

 
    axios
      .post("/createOrder_Api.php", {
        OrderNumber: orderNumber,
        OrderDate: `${orderDate.getFullYear()}-${
          orderDate.getMonth() + 1
        }-${orderDate.getDate()}`,
        Status: 0,
        TotalAmount: totalPrice,
        menuItemID: JSON.stringify(order.map((el) => el.MenuItemID)),
        quantity: JSON.stringify(order.map((el) => el.quantity)),
        take_away: takeAway,
        adjustments: JSON.stringify(allAdjustments),
        ItemName: JSON.stringify(order.map((el) => el.ItemName)),
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
        handleSideDishes,
        handleOrderAdjustments,
        handleAdjustmentsReset,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};
export default OrdersContext;
