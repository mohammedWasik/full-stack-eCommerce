import React, { Fragment, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import Typography from "@mui/material/Typography";
import Loader from "../Loader/Loader.js";
import { DataGrid } from "@mui/x-data-grid";
import { clearErrors, myOrdersAction } from "../../actions/orderActions.js";
import "./MyOrder.css";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

const MyOrders = () => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { loading, error, orders } = useSelector((state) => state.myOrders);
  const { user } = useSelector((state) => state.user);

  const rows = [];
  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 220 },
    {
      field: "status",
      headerName: "Status",
      cellClassName: (params) => {
        return params.row.status === "Processing"
          ? "text-red-600"
          : "text-green-600";
      },
    },
    {
      field: "itemsQuantity",
      headerName: "Quantity ",
      type: "number",
    },

    {
      field: "amount",
      headerName: "Amount",
      type: "number",
    },

    {
      field: "actions",
      headerName: "Actions",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/order/${params.row.id}`}>
            <RocketLaunchIcon />
          </Link>
        );
      },
    },
  ];

  orders?.forEach((item, index) => {
    rows.push({
      id: item._id,
      status: item.orderStatus,
      itemsQuantity: item.orderItems.length,
      amount: item.totalPrice,
    });
  });

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(myOrdersAction());
  }, [alert, dispatch, error]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <div className="myOrdersDiv">
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } },
            }}
            pageSizeOptions={[1, 5, 10, 25]}
            disableRowSelectionOnClick
            className="OrdersTable"
            autoHeight
          />
        </div>
      )}
    </Fragment>
  );
};

export default MyOrders;
