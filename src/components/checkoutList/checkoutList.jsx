import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import React, { useContext } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useFormik } from "formik";
import * as yup from "yup";
import "./checkoutList.css";
import noOrders from "../../assets/images/ordersList.png";
import OrdersContext from "../../context/orders";
import API from "../../apiEndPoint";

const CheckOutList = () => {
  const {
    orders,
    inCreamentQuantity,
    deCreamentQuantity,
    totalPrice,
    submitOrder,
  } = useContext(OrdersContext);
  const formik = useFormik({
    initialValues: {
      takeAway: false,
    },
    validationSchema: yup.object({
      takeAway: yup.boolean().oneOf([true, false]),
    }),

    onSubmit: (data) => submitOrder(data),
  });

  // displayed when there are no orders .
  if (!orders.length) {
    return (
      <Grid container alignItems={"center"} minHeight={"70vh"}>
        <Box
          component="img"
          sx={{
            width: "100%",
          }}
          alt="No orders to view"
          src={noOrders}
        />
      </Grid>
    );
  } else {
    return (
      <Grid container>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Typography variant="h4"> Your Cart </Typography>
        </Grid>
        <form onSubmit={formik.handleSubmit}>
          {orders &&
            orders.map(
              ({ ItemName, Image, AdminItemID, Description, quantity }) => {
                return (
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    key={AdminItemID}
                    className="menueItem"
                  >
                    <Grid container justifyContent={"space-around"}>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        lg={4}
                        className="imageContainer"
                      >
                        <img src={`${API}/uploads/${Image}`} alt={ItemName} />
                      </Grid>
                      <Grid
                        item
                        xs={9}
                        sm={9}
                        md={6}
                        lg={6}
                        className="infoContainer"
                      >
                        <h2>
                          <span className="title">{ItemName}</span>
                        </h2>
                        <p>{Description}</p>
                      </Grid>
                      <Grid
                        item
                        xs={3}
                        sm={3}
                        md={1}
                        lg={1}
                        className="quantity"
                      >
                        <Grid
                          container
                          height="100%"
                          margin={2}
                          alignItems={"space-around"}
                          justifyContent={"center"}
                          textAlign={"center"}
                        >
                          <Button
                            onClick={() => inCreamentQuantity(AdminItemID)}
                          >
                            <KeyboardArrowUpIcon />
                          </Button>

                          <Typography variant="h5">{quantity}</Typography>

                          <Button
                            onClick={() => deCreamentQuantity(AdminItemID)}
                          >
                            <KeyboardArrowDownIcon />
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                );
              }
            )}

          <Grid container marginTop = {4} paddingLeft ={2}>
            <Grid
              item
              xs={12}
              sm={12}
              lg={12}
              xl={12}
              display={"flex"}
              alignItems={"center"}
            >
              <TextField
                type="checkbox"
                name = {"takeAway"}
                onChange={formik.handleChange}
                className="checkbox"
              />
              <Typography paddingLeft={2} typography={"h6"}>
                {" "}
                Take Away{" "}
              </Typography>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} padding={2}>
            <Grid container justifyContent={"space-between"}>
              <Typography variant="h5" color="disabled">
                Total Price :{" "}
              </Typography>
              <Typography
                variant="h5"
                color="error"
                display={"flex"}
                alignItems={"center"}
              >
                {totalPrice} <AttachMoneyIcon fontSize="15px" />
              </Typography>
            </Grid>
          </Grid>

          <Grid item xs = {12} lg ={12}>
            <Button fullWidth color="warning" variant="outlined" onClick = {formik.handleSubmit}>
              Submit Order 
            </Button>
          </Grid>
        </form>
      </Grid>
    );
  }
};

export default CheckOutList;
