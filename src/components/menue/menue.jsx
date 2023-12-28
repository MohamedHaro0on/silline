import { useContext, useEffect, useState } from "react";

import {
  Grid,
  Typography,
  Button,
  CardMedia,
  CardContent,
  Card,
} from "@mui/material";

import MenueContext from "../../context/menue";
import OrdersContext from "../../context/orders";
import "./menue.css";
import CategoriesContext from "../../context/categories";
import API from "../../apiEndPoint.js";
import AdjustmentModal from "./adjustmentModal.jsx";
const Menue = () => {
  const { menue } = useContext(MenueContext);
  const { cat } = useContext(CategoriesContext);
  const { ordersHandler, adjustmentModal } = useContext(OrdersContext);
  const [displayedItems, setDisplayedItems] = useState([]);
  const [index, setIndex] = useState(null);

  useEffect(() => {
    if (cat !== "all") {
      let temp = menue.map((el) => el);
      temp = temp.filter((el) => el.CategoryName === cat);
      setDisplayedItems(temp);
    } else {
      setDisplayedItems(menue);
    }
  }, [cat, menue]);

  return (
    <Grid container display="flex" alignItems={"stretch"} className = "itemsContainer">
      {displayedItems.length > 0 &&
        displayedItems.map(
          ({ ItemName, Image, bestSeller, MenuItemID, Price }, index) => {
            return (
              <Grid
                key={MenuItemID + ItemName}
                item
                xs={12}
                sm={12}
                md={6}
                lg={6}
                xl={4}
                padding={2}
                alignItems={"stretch"}
                display={"flex"}
                className="cardContainer"
              >
                <Button
                  color="warning"
                  fullWidth
                  onClick={() => { setIndex(index); ordersHandler(MenuItemID) }}
                >
                  <Card className="card">
                    <CardMedia
                      sx={{ height: 140 }}
                      image={`${API}/uploads/${Image}`}
                      title={ItemName}
                      className="itemImage"
                    />
                    <CardContent className="cardContent">
                      <Grid container>
                        <Grid item xs={12} padding ={0}>
                          <Typography
                            gutterBottom
                            variant="h5"
                            component="h5"
                            textAlign={"left"}
                          >
                            {ItemName}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} textAlign={"end"} padding = {0}>
                          <Typography
                            gutterBottom
                            variant="h6"
                            component="div"
                            color="error"
                          >
                            {Price} NOK
                          </Typography>
                        </Grid>
                      </Grid>
                      {Boolean(bestSeller) && (
                        <Typography
                          className="bestSeller"
                          varient="h5"
                          component="div"
                        >
                          {" "}
                          Best Seller
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Button>
              </Grid>
            );
          }
        )}
      {
        index !== null &&
        displayedItems[index] &&
        displayedItems[index].adjustedTitles &&
        displayedItems[index].Titles &&
        adjustmentModal &&
        <AdjustmentModal item={displayedItems[index]} />
      }

    </Grid>
  );
};

export default Menue;
