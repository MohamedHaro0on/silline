/* eslint-disable no-mixed-operators */
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import "./checkoutList.css";
import noOrders from "../../assets/images/ordersList.png";
import OrdersContext from "../../context/orders";
import API from "../../apiEndPoint";
import Vipps from "../../assets/images/Vipps.png"


const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  textAlign: "center",
  borderRadius: "20px",
  borderColor: "none"
};



const CheckOutList = () => {
  const {
    order,
    inCreamentQuantity,
    deCreamentQuantity,
    totalPrice,
    open,
    handleOpen,
    handleClose,
    loading,
    getPaymentURL,
    takeAway,
    setTakeAway,
    cancelOrder
  } = useContext(OrdersContext);


  if (!order.length) {
    return (
      <Grid container className="checkOut">
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
      <Grid container className="checkOut">
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Typography variant="h4"> Your Cart </Typography>
        </Grid>
        <form >
          {order &&
            order.map(
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
                value={takeAway}
                onChange={() => { setTakeAway(prevState => !prevState) }}
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
                {`${totalPrice} Kr`}
              </Typography>
            </Grid>
          </Grid>

          <Grid item xs={12} lg={12}>
            <Button
              fullWidth
              color="warning"
              variant="outlined"
              onClick={handleOpen}
              padding={2}
            >
              <Typography variant="h5" marginRight={3}>
                {" "}
                Submit Order{" "}
              </Typography>
              {loading && <CircularProgress color="warning" />}
            </Button>
          </Grid>
        </form>


        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h5"
              component="h2"
              fontWeight="bolder"
              marginBottom={4}
              textAlign={"start"}
            >
              you ordered :
            </Typography>
            <Grid item xs={12}>
              <ul>{order && order.length > 0 && order.map((({ ItemName, quantity, adjustments, sideDishes }) => {
                return (
                  <li key={ItemName} style={{ padding: "10px" }}>
                    <Typography variant="p">
                      <strong>({quantity}) &nbsp; {ItemName} . </strong>
                    </Typography>
                    {<ul style={{ textAlign: "start", paddingTop: "10px" }}>
                      {sideDishes && sideDishes.map((sideDish) => <li key={sideDish}>{sideDish.ItemName} . </li>)}
                      {adjustments && adjustments.map((adjustment) => <li key={adjustment.title}>{adjustment.title} : {adjustment.adj.label} . </li>)}
                    </ul>}
                  </li>
                )
              })
              )}
              </ul>
            </Grid>
            <Grid container padding={4} >
              <Grid item xs={12} display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                <Typography variant="h6" > Total Price </Typography>
                <Typography variant="h6" color="error"> {totalPrice} NOK </Typography>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12} textAlign={"center"} display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
              <Button color="error" fullWidth variant="contained" padding={2} onClick={() => { cancelOrder(); handleClose() }}> Cancel Order </Button>
            </Grid>
            <Grid item xs={12} sm={12} marginTop={3}>
              <Button
                fullWidth
                onClick={() => { getPaymentURL(); handleClose(); }}
                color="warning"
                style={{ borderColor: "#ff5b24", color: "#ff5b24", display: "flex", justifyContent: "center", textAlign: "center" }}
                variant="outlined">
                <Box component={"img"}
                  sx={{
                    maxWidth: "20px",
                    padding: 1
                  }} src={Vipps} />


                <Typography variant={"span"} width={"fit-content"} > Complete Payment with Vipps</Typography>
              </Button>
            </Grid>
          </Box>
        </Modal>

      </Grid >
    );
  }
};

export default CheckOutList;
