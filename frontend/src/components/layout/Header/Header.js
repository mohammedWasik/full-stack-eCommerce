import React from "react";
import { ReactNavbar } from "overlay-navbar";
import logo from "../../../images/logo.png";
import { MdSearch } from "react-icons/md";
import { MdAddShoppingCart } from "react-icons/md";
import { FaUserAlt } from "react-icons/fa";
import "./header.css";

const options = {
  burgerColorHover: "#ff3454",
  logo,
  logoWidth: "20vmax",
  navColor1: "white",
  logoHoverSize: "10px",
  logoHoverColor: "#eb4034",
  link1Text: "Home",
  link2Text: "Products",
  link3Text: "Contact",
  link4Text: "About",
  link1Url: "/",
  link2Url: "/products",
  link3Url: "/contact",
  link4Url: "/about",
  link1Size: "1.3vmax",
  link1Color: "rgba(35, 35, 35,0.8)",
  nav1justifyContent: "flex-end",
  nav2justifyContent: "flex-end",
  nav3justifyContent: "flex-start",
  nav4justifyContent: "flex-start",
  link1ColorHover: "#eb4034",
  link1Margin: "1vmax",
  profileIconColor: "rgba(35, 35, 35,0.8)",
  searchIconColor: "rgba(35, 35, 35,0.8)",
  cartIconColor: "rgba(35, 35, 35,0.8)",
  profileIconColorHover: "#eb4034",
  searchIconColorHover: "#eb4034",
  cartIconColorHover: "#eb4034",
  cartIconMargin: "1vmax",
  profileIcon: true,
  ProfileIconElement: FaUserAlt,
  profileIconUrl: "/login",
  searchIcon: true,
  SearchIconElement: MdSearch,
  cartIcon: true,
  CartIconElement: MdAddShoppingCart,
  logoAnimationTime: 0.2,
  link1AnimationTime: 0.2,
  link2AnimationTime: 0.2,
  link3AnimationTime: 0.2,
  link4AnimationTime: 0.2,
  searchIconAnimationTime1: 0.2,
  cartIconAnimationTime: 0.2,
  searchIconAnimationTime: 0.2,
  profileIconAnimationTime: 0.2,
};

const Header = () => {
  return <ReactNavbar {...options} className="" />;
};

export default Header;
