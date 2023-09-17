import React, { useEffect } from "react";
import "./App.css";
import Header from "./components/layout/Header/Header.js";
import Footer from "./components/layout/Footer/Footer.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WebFont from "webfontloader";
import Home from "./components/Home/Home.js";
import ProductDetailsPage from "./components/Product/ProductDetailsPage.js";
import ScrollToTop from "./ScrollToTop.js";
import Products from "./components/Product/Products.js";
import Search from "./components/Product/Search.js";
import Cart from "./components/cart/Cart.js";
import ProcessPayment from "./components/cart/ProcessPayment.js";
import Success from "./components/cart/Success.js";
import Shipping from "./components/cart/Shipping.js";
import ConfirmOrder from "./components/cart/ConfirmOrder.js";
import LoginSignUp from "./components/User/LoginSignUp";
import MyOrders from "./components/Order/MyOrders.js";
import OrderDetails from "./components/Order/OrderDetails.js";
import store from "./store";
import { loadUserAction } from "./actions/userActions";
import UserOptions from "./components/layout/Header/UserOptions.js";
import { useSelector } from "react-redux";
import Account from "./components/User/Account.js";
import UpdateProfile from "./components/User/UpdateProfile.js";
import PasswordUpdate from "./components/User/PasswordUpdate.js";
import ForgotPassword from "./components/User/ForgotPassword.js";
import ResetPassword from "./components/User/ResetPassword.js";
import ProtectedRoutes from "./components/ProtectedRoute/ProtectedRoutes";

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });
    store.dispatch(loadUserAction());
  }, []);

  return (
    <Router>
      <ScrollToTop>
        <Header />
        {isAuthenticated && <UserOptions user={user} />}

        <Routes>
          <Route exact path="/" Component={Home} />
          <Route exact path="/products" Component={Products} />
          <Route path="/products/:keyword" Component={Products} />
          <Route exact path="/product/:id" Component={ProductDetailsPage} />
          <Route exact path="/login" Component={LoginSignUp} />
          <Route exact path="/search" Component={Search} />
          <Route exact path="/password/forgot" Component={ForgotPassword} />
          <Route
            exact
            path="/password/reset/:token"
            Component={ResetPassword}
          />
          <Route exact path="/cart" Component={Cart} />

          <Route element={<ProtectedRoutes />}>
            <Route exact path="/account" Component={Account} />
            <Route exact path="/me/update" Component={UpdateProfile} />
            <Route exact path="/account" Component={Account} />
            <Route exact path="/password/update" Component={PasswordUpdate} />
            <Route exact path="/shipping" Component={Shipping} />
            <Route exact path="/order/confirm" Component={ConfirmOrder} />
            <Route exact path="/process/payment" Component={ProcessPayment} />
            <Route exact path="/success" Component={Success} />
            <Route exact path="/orders" Component={MyOrders} />
            <Route exact path="/order/:id" Component={OrderDetails} />
          </Route>
        </Routes>
      </ScrollToTop>
      <Footer />
    </Router>
  );
}

export default App;
