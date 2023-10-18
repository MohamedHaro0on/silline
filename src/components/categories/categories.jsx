import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import Carousel from "react-multi-carousel";
import { useContext } from "react";

import "react-multi-carousel/lib/styles.css";
import "./categories.css";
import CategoriesContext from "../../context/categories";
import API from "../../apiEndPoint"; 

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 6,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 6,
  },
  tablet: {
    breakpoint: { max: 1024, min: 495 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 495, min: 0 },
    items: 1,
  },
};

const Categories = ({ catHandler }) => {
  const { categories , setCat } = useContext(CategoriesContext);
  return (
    <Grid container className="navbarContainer">
      <Carousel
        className="carousel"
        responsive={responsive}
        swipeable={true}
        draggable={true}
        showDots={false}
        ssr={true} // means to render carousel on server-side.
        infinite={true}
        keyBoardControl={true}
        transitionDuration={1000}
        autoPlay={true}
        arrows={true}
      >
        {categories.map(({ CategoryID, CategoryName, CategoryPicture }) => (
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            padding={2}
            key={CategoryID}
          >
            <Button
              onClick={() => setCat(CategoryName)}
              fullWidth={true}
              color="warning"
            >
              <Card className="card" color="error">
                <CardMedia
                  sx={{ height: 130 }}
                  image={`${API}/uploads/${CategoryPicture}`}
                  title={CategoryName}
                />
                <CardContent>
                  <Typography gutterBottom variant="p" component="div">
                    {CategoryName}
                  </Typography>
                </CardContent>
              </Card>
            </Button>
          </Grid>
        ))}
      </Carousel>
    </Grid>
  );
};

export default Categories;
