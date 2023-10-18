import { Grid, Typography } from "@mui/material";
import Categories from "./components/categories/categories";
import CheckOutList from "./components/checkoutList/checkoutList";
import { useContext } from "react";
import CategoriesContext from "./context/categories";
import Menue from "./components/menue/menue";
const HomePage = () => {
  const { cat } = useContext(CategoriesContext);
  return (
    <Grid container padding={3}>
      {/* Select category */}
      <Grid item xs={12} sm={12} lg={12} md={12}>
        <Categories />
      </Grid>

      {/* Menues And Orders */}
      <Grid container>
        <Grid item xs={12} sm={12} md={8} lg={8}>
          <Grid container>
            <Grid item xs={12} sm={12} lg={12} md={12} textAlign={"center"}>
              <Typography variant="h3"> {cat}</Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Menue />
            </Grid>
          </Grid>
        </Grid>

        {/* Orders user Made */}
        <Grid
          item
          xs={12}
          sm={12}
          md={4}
          lg={4}
          bgcolor={"#eee"}
          borderRadius={"20px"}
          padding={3}
        >
          <CheckOutList />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default HomePage;
