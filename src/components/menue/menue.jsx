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
const Menue = () => {
  const { menue } = useContext(MenueContext);
  const { cat } = useContext(CategoriesContext);
  const { ordersHandler } = useContext(OrdersContext);
  const [displayedItems, setDisplayedItems] = useState([]);

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
    <Grid container display = "flex" alignItems={"stretch"}>
      {displayedItems.length > 0 &&
        displayedItems.map(
          ({
            ItemName,
            Image,
            bestSeller,
            MenuItemID,
            Price,
            best_seller,
          }) => {
            return (
              <Grid
                key={MenuItemID + ItemName}
                item
                xs={12}
                sm={12}
                md={6}
                lg={6}
                xl={4}
                padding={4}
                alignItems={"stretch"}
                display={"flex"}
                className = "cardContainer"
              >
                <Button
                  color="warning"
                  fullWidth
                  onClick={() => ordersHandler(MenuItemID)}
                >
                  <Card className="card">
                    <CardMedia
                      sx={{ height: 140 }}
                      image={`${API}/uploads/${Image}`}
                      title={ItemName}
                    />
                    <CardContent className= "cardContent">
                      <Grid container>
                        <Grid item xs={9} sm={9} md={9} lg={9}>
                          <Typography gutterBottom variant="h6" component="h5" textAlign={"left"}>
                            {ItemName}
                          </Typography>
                        </Grid>
                        <Grid item xs={3} sm={3} md={3} lg={3}>
                          <Typography
                            gutterBottom
                            variant="h6"
                            component="div"
                            color="error"
                          >
                            {Price}
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
    </Grid>
  );
};

export default Menue;
