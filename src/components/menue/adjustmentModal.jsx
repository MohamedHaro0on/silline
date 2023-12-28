import React, { useContext, useState, Fragment } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Card, CardContent, CardMedia, Checkbox, Grid, Modal } from "@mui/material";


import OrdersContext from "../../context/orders";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';

import "./menue.css";
import API from "../../apiEndPoint";
import MenueContext from "../../context/menue";


const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
  textAlign: "center",
  borderRadius: "50px",
  border: "none"
};

const AdjustmentModal = ({ item }) => {
  const [activeStep, setActiveStep] = useState(-1);
  const [skipped, setSkipped] = useState(new Set());
  const { order, adjustmentModal, setAdjustmentModal, handleSideDishes, handleOrderAdjustments, handleAdjustmentsReset } = useContext(OrdersContext);

  const { menue } = useContext(MenueContext);

  const isStepOptional = (step) => {
    return step > item.Titles.length;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    if (item.Titles.length === activeStep) {
      setAdjustmentModal(false)
    }
    else {
      let newSkipped = skipped;
      if (isStepSkipped(activeStep)) {
        newSkipped = new Set(newSkipped.values());
        newSkipped.delete(activeStep);
      }

      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped(newSkipped);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
    handleAdjustmentsReset(item);
  };


  let Displayed = null;
  if (activeStep === -1) {
    let { MenuItemID, ItemName, bestSeller, Image, Description, AllergyInfo } = item;
    Displayed = (
      <Grid>
        <Grid
          key={MenuItemID + ItemName}
          item
          xs={12}
          sm={12}
          padding={4}
          alignItems={"stretch"}
          display={"flex"}
        >

          <Card className="card">
            <Grid container padding={2}>
              <Grid item xs={12} >
                <Typography
                  gutterBottom
                  variant="h6"
                  component="h5"
                  textAlign={"left"}
                >
                  {ItemName}
                </Typography>
              </Grid>
            </Grid>
            <CardMedia
              sx={{ height: 140 }}
              image={`${API}/uploads/${Image}`}
              title={ItemName}
              className="itemImage"
            />
            <CardContent className="cardContent">
              <Grid container>

                <Grid item xs={12}>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    textAlign={"left"}
                  >
                    {Description}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    textAlign={"left"}
                  >
                    Allergy  : {AllergyInfo}
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
        </Grid>
      </Grid>
    )
  }
  else if (activeStep === item.Titles.length) {
    Displayed = (
      <Grid container padding={2}>
        {menue.filter(el => el.CategoryName === "Sides").map(sideDish => {
          return (
            <Grid item xs={12} textAlign={"start"} padding={2} borderBottom="solid 2px #eee" display={"flex"} justifyContent={"space-between"}>
              <div>
              <Typography>{sideDish.ItemName}</Typography>
              <Typography variant="h6"  fontSize={"1rem"} color={"error"}> + {sideDish.Price} Kr </Typography>
              </div>
              <FormControlLabel
                control={<Checkbox value={sideDish.itemName}
                  defaultValue={sideDish.itemName}
                />
                }
                label={sideDish.itemName}
                onChange={() => handleSideDishes(item, sideDish)} />
              

            </Grid>
          )
        })}
      </Grid>
    )
  }
  else if (activeStep < item.Titles.length && activeStep > -1) {
    Displayed = (
      <Grid container textAlign={"start"} >
        <Grid container padding={2}>
          <FormControl fullWidth>
            <FormLabel id={`item.adjustedTitles[item.Titles[${activeStep}]].adjustmentInfo`}>
              <Typography variant={"h4"}>{item.Titles[activeStep]}</Typography>
            </FormLabel>
            <Grid padding={2} item xs={12}>
              <RadioGroup
                aria-labelledby={item.adjustedTitles[item.Titles[activeStep]].adjustmentInfo[0].label}
                name={`item.adjustedTitles[item.Titles[${activeStep}]].adjustmentInfo[0].label`}
                className="radioGroup"
                defaultChecked={`item.adjustedTitles[item.Titles[${activeStep}]].adjustmentInfo[0].label`}
              >
                {item.adjustedTitles[item.Titles[activeStep]].adjustmentInfo.map((adj) => {
                  let temp = order.map((el) => el); //
                  const index = temp.findIndex((x) => x.MenuItemID === item.MenuItemID);
                  const { adjustments } = temp[index];
                  const currentAdjustment = adjustments && adjustments.filter(el => el.title === item.Titles[activeStep]);
                  return (
                    <Grid item xs={12} padding={2} borderBottom={"solid 2px #eee"} key={adj.title + adj.label}>
                      <FormControlLabel
                        className="formControl"
                        labelPlacement="start"
                        value={adj.label}
                        control={
                          <Radio
                            defaultValue={adj.label}
                            checked={currentAdjustment && currentAdjustment[0] && currentAdjustment[0].adj.label === adj.label}
                          />}
                        label={adj.label}
                        onChange={(e) => {
                          handleOrderAdjustments(adj, item.Titles[activeStep], item)
                        }}
                      />
                      <Typography variant="h6" paddingLeft={2} fontSize={"1rem"} color={"error"}> + {adj.price} Kr </Typography>
                    </Grid>
                  )
                })}
              </RadioGroup>
            </Grid>
          </FormControl>
        </Grid>
      </Grid>
    )
  }


  // eslint-disable-next-line array-callback-return
  let steps = Array.apply(null, Array(item.Titles.length + 1)).map(function () { })

  return (
    <Modal
      open={adjustmentModal}
      onClose={() => setAdjustmentModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >

      <Box sx={style}>
        <Grid item xs={12} padding={2}>
          <Typography variant="h5"> {item && item.ItemName}</Typography>
        </Grid>

        <Stepper activeStep={activeStep}>
          {steps.map((_, index) => {
            const stepProps = {};
            const labelProps = {};
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={index} {...stepProps} >
                <StepLabel {...labelProps}></StepLabel>
              </Step>
            );
          })}
        </Stepper>


        <Fragment>
          {Displayed}

          {/* Next , Back , Skip , Submit Buttons */}
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === -1}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Skip
              </Button>
            )}

            <Button onClick={handleNext}>
              {activeStep === item.Titles.length ? "Finish" : "Next"}
            </Button>
          </Box>
        </Fragment>
      </Box>
    </Modal>
  );
}


export default AdjustmentModal; 