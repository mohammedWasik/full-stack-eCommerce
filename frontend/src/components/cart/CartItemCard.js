import React from "react";
import "./CartItemCard.css";
import { Link } from "react-router-dom";
const CartItemCard = ({ item, removeFromCart }) => {
  return (
    <div className="CartItemCard">
      <img src={item.image} alt="itemImage" />
      <div>
        <Link to={`/product/${item.product}`}>{item.name}</Link>
        <span>{`Price: $${item.price}`}</span>
        <button onClick={() => removeFromCart(item.product)}>Remove</button>
      </div>
    </div>
  );
};

export default CartItemCard;
