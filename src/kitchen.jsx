import { useContext } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "react-toastify/dist/ReactToastify.css";
import OrdersContext from "./context/orders";
import { Grid } from "@mui/material";

const userColumns = [
  { field: "OrderID", headerName: "Order Id", width: 170 },
  { field: "Quantity", headerName: "Quantity", width: 200 },
  { field: "SelectedItemNames", headerName: "Order Items ", width: 300 },
  { field: "TotalAmount", headerName: "Price", width: 260 },
];

const Floors = () => {
  const { prevOrders } = useContext(OrdersContext);
  console.log(prevOrders);
  return (
    <Grid container padding={3}>
      <DataGrid
        className="datagrid"
        rows={prevOrders}
        getRowId={(row) => row.OrderID}
        columns={userColumns}
        pageSize={9}
        rowsPerPageOptions={[5]}
      />
    </Grid>
  );
};

export default Floors;
