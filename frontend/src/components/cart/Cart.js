import React, { Fragment } from "react";
import "./Cart.css";
import CartItemCard from "./CartItemCard.js";
import { useDispatch, useSelector } from "react-redux";
import {
  addItemsToCartAction,
  removeFromCartAction,
} from "../../actions/cartActions";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems } = useSelector((state) => state.cart);

  const increaseQuantity = (id, quantity, stock) => {
    const newQuantity = quantity + 1;
    if (stock <= quantity) return;
    dispatch(addItemsToCartAction(id, newQuantity));
  };
  const decreaseQuantity = (id, quantity) => {
    if (quantity <= 1) return;
    const newQuantity = quantity - 1;
    dispatch(addItemsToCartAction(id, newQuantity));
  };

  const removeFromCart = (id) => {
    dispatch(removeFromCartAction(id));
  };
  const totalPrice = () => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    );
    return total;
  };
  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <Fragment>
      {cartItems.length === 0 ? (
        "No items in cart"
      ) : (
        <Fragment>
          <div className="cartPage">
            <div className="cartHeader">
              <p>Product</p>
              <p>Quantity</p>
              <p>Subtotal</p>
            </div>
            {cartItems?.map((item) => (
              <div className="cartContainer" key={item.product}>
                <CartItemCard item={item} removeFromCart={removeFromCart} />
                <div className="cartInput">
                  <button
                    onClick={() =>
                      decreaseQuantity(item.product, item.quantity)
                    }>
                    -
                  </button>
                  <input type="number" value={item.quantity} readOnly />
                  <button
                    onClick={() =>
                      increaseQuantity(item.product, item.quantity, item.stock)
                    }>
                    +
                  </button>
                </div>
                <p className="cartSubtotal">{`$${
                  item.price * item.quantity
                }`}</p>
              </div>
            ))}
            <div className="cartGrossProfit">
              <div></div>
              <div className="cartGrossProfitBox">
                <p>Total</p>
                <p>{`$ ${totalPrice()}`}</p>
              </div>
              <div></div>
              <div className="checkOutBtn">
                <button onClick={checkoutHandler}>Check Out</button>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Cart;
