import React, { Fragment, useState } from "react";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import "./header.css";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import { logoutUser } from "../../../actions/userActions";
import Backdrop from "@mui/material/Backdrop";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const UserOptions = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const alert = useAlert();

  const [open, setOpen] = useState(false);

  const orders = () => {
    navigate("/orders");
  };
  const account = () => {
    navigate("/account");
  };

  const logout = () => {
    dispatch(logoutUser());
    alert.success("logout successfully");
    navigate("/");
  };
  const dashboard = () => {
    navigate("/dashboard");
  };
  const cart = () => {
    navigate("/cart");
  };
  const options = [
    { icon: <ShoppingCartIcon />, name: "Cart", func: cart },
    { icon: <ListAltIcon />, name: "Orders", func: orders },
    { icon: <AccountBoxIcon />, name: "Profile", func: account },
    { icon: <ExitToAppIcon />, name: "Logout", func: logout },
  ];

  if (user.role === "admin") {
    options.unshift({
      icon: <DashboardIcon />,
      name: "Dashboard",
      func: dashboard,
    });
  }

  return (
    <Fragment>
      <Backdrop open={open} style={{ zIndex: "10" }} />
      <SpeedDial
        className="speedDial"
        ariaLabel="SpeedDial tooltip example"
        direction="down"
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        icon={
          <img
            className="speedDialIcon"
            src={user.avatar.url_id ? user.avatar.url_id : "/Profile.png"}
            alt="userPic"
          />
        }>
        {options.map((item) => (
          <SpeedDialAction
            key={item.name}
            icon={item.icon}
            tooltipTitle={item.name}
            onClick={item.func}
          />
        ))}
      </SpeedDial>
    </Fragment>
  );
};

export default UserOptions;
