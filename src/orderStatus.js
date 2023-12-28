import { Grid } from "@mui/material";
import React, { useContext, useEffect } from "react";
import OrdersContext from "./context/orders";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";

function OrderStatus() {
  const { submitOrder, orderNumber, paymentStatus, loading } =
    useContext(OrdersContext);
  useEffect(() => {
    submitOrder();
  }, []);

  
  if (!loading) {
    let output,
      number,
      icon = null;
    switch (paymentStatus) {
      case "INITIATE": {
        output =
          "you are still making your payment ... we will save your order untill you finish";
        number = orderNumber;
        icon = <CheckIcon style={{fontSize : "4rem"}} color="success" />;
        break;
      }
      case "CANCEL": {
        output = "we are sorry ,, you didn't complete your payment operation !";
        icon = <ClearIcon style={{fontSize : "4rem"}} color="error" />;
        break;
      }
      case "RESERVE": {
        output =
          "you have completed payment Successfully , we will receive the transfer as soon as possible";
        number = orderNumber;
        icon = <CheckIcon style={{fontSize : "4rem"}} color="success" />;
        break;
      }
      case "REFUND": {
        output = "we have refunded the amount you transferred";
        icon = <CheckIcon style={{fontSize : "4rem"}} color="success" />;
        break;
      }
      case "SALE": {
        output =
          "We have received your payment transfer , Thank you for choosing us";
        number = orderNumber;
        icon = <CheckIcon style={{fontSize : "4rem"}} color="success" />;
        break;
      }
      case "VOID": {
        output = "your payment was cancelled";
        icon = <ClearIcon style={{fontSize : "4rem"}} color="error" />;
        break;
      }
      default:
        output = "you didn't make any orders";
        icon = <ClearIcon style={{fontSize : "4rem"}} color="error" />;
        break;
    }
    return (
      <Grid
        container
        bgcolor={"#fbe1c6"}
        minHeight={"100vh"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Card
          sx={{
            maxWidth: 375,
            Height: "50%",
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "20px",
            textAlign: "center",
          }}
        >
          <CardContent>
            <Typography variant="h6">{icon}</Typography>
            <Typography variant="h6">{output}</Typography>
            <Typography variant="h6">
              {number && "your order number is : " + orderNumber}
            </Typography>
          </CardContent>
          <CardActions>
            <Grid item xs={12} display={"flex"} justifyContent={"center"}>
              <Button
                color="warning"
                style={{ textAlign: "center" }}
                size="small"
                variant = "outlined"
              >
                {" "}
                <Link to="/" color="warning"> return to the main Page </Link>
              </Button>
            </Grid>
          </CardActions>
        </Card>{" "}
      </Grid>
    );
  }
}

export default OrderStatus;
