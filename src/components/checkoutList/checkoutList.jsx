import { Box, Button, CircularProgress, Grid, Modal, TextField, Typography } from "@mui/material";
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
import orderSubmitted from "../../assets/images/orderSubmitted.png";
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  textAlign: "center",
};

const CheckOutList = () => {
  const {
    orders,
    inCreamentQuantity,
    deCreamentQuantity,
    totalPrice,
    submitOrder,
    open,
    handleClose,
    orderNumber , 
    loading ,
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
         <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h5" component="h2" fontWeight = "bolder" marginBottom={4}>
              your order id : {orderNumber}
            </Typography>
            <Box
              component="img"
              sx={{
                height: 200,
                maxHeight: { xs: 233, md: 167 },
                maxWidth: { xs: 350, md: 250 },
              }}
              alt="order was submitted"
              src={orderSubmitted}
            />
          </Box>
        </Modal>
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
              ({ ItemName, Image, MenuItemID, Description, quantity }) => {
                return (
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    key={MenuItemID}
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
                            onClick={() => inCreamentQuantity(MenuItemID)}
                          >
                            <KeyboardArrowUpIcon />
                          </Button>

                          <Typography variant="h5">{quantity}</Typography>

                          <Button
                            onClick={() => deCreamentQuantity(MenuItemID)}
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

          <Grid container marginTop={4} paddingLeft={2}>
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
                name={"takeAway"}
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

          <Grid item xs={12} lg={12}>
            <Button fullWidth color="warning" variant="outlined" onClick={formik.handleSubmit}>
              Submit Order
              {loading && <CircularProgress />}
            </Button>
          </Grid>
        </form>

       
      </Grid>
    );
  }
};

export default CheckOutList;
