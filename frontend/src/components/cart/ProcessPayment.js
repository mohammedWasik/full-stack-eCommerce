import React, { Fragment, useEffect } from "react";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, createOrderAction } from "../../actions/orderActions";
import CheckoutSteps from "./CheckoutSteps";

const ProcessPayment = () => {
  const navigate = useNavigate();
  const alert = useAlert();
  const dispatch = useDispatch();

  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { error } = useSelector((state) => state.newOrder);

  const order = {
    shippingInfo,
    orderItems: cartItems,
    itemsPrice: orderInfo.subtotal,
    taxPrice: orderInfo.tax,
    shippingPrice: orderInfo.shippingCharges,
    totalPrice: orderInfo.totalPrice,
  };

  const paymentSuccess = () => {
    order.paymentInfo = {
      id: user._id + order.totalPrice,
      status: "succeeded",
    };
    dispatch(createOrderAction(order));
    navigate("/success");
  };
  const paymentFailure = () => {
    alert.error("payment failed");
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error, alert]);

  return (
    <Fragment>
      <CheckoutSteps activeStep={3} />

      <div className="m-14 flex flex-col justify-center items-center ">
        <button
          className="bg-green-500 text-white m-10 w-3/6 h-20 rounded-lg"
          onClick={paymentSuccess}>
          Payment Success
        </button>
        <button
          className="bg-red-500 text-white m-10 w-3/6 h-20 rounded-lg"
          onClick={paymentFailure}>
          Payment Failed
        </button>
      </div>
    </Fragment>
  );
};

export default ProcessPayment;
