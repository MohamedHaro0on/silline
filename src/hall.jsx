import { useContext } from "react";
import OrdersContext from "./context/orders";
import { Grid } from "@mui/material";

const Hall = () => {
  const { prevOrders } = useContext(OrdersContext);
  return (
    <Grid container display="flex" justifyContent="center" padding={4}>
      {prevOrders &&
        prevOrders.map(({ OrderNumber , OrderID  }) => {
          return (
            <Grid key = {OrderID} item xs={12} lg={12} md={12} sm={12} className="hallList">
              {" "}
              {OrderNumber}
            </Grid>
          );
        })}
    </Grid>
  );
};

export default Hall;
