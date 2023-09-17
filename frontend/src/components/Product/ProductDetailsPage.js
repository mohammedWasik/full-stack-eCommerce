import React, { Fragment, useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import "./ProductDetails.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProductDetails } from "../../actions/productActions";
import { useParams } from "react-router-dom";
import { Rating } from "@mui/material";
import ReviewCard from "./ReviewCard.js";
import { useAlert } from "react-alert";
import Loader from "../Loader/Loader";
import { addItemsToCartAction } from "../../actions/cartActions";

const ProductDetailsPage = ({ match }) => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );

  const { id } = useParams();

  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => {
    if (product.quantity <= quantity) return;
    const qty = quantity + 1;
    setQuantity(qty);
  };
  const decreaseQuantity = () => {
    if (quantity <= 1) return;

    const qty = quantity - 1;
    setQuantity(qty);
  };

  const addToCart = () => {
    dispatch(addItemsToCartAction(id, quantity));
    alert.success("items added to cart");
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProductDetails(id));
  }, [dispatch, id, error, alert]);

  const ratingOptions = {
    value: product?.ratings,
    readOnly: true,
    precision: 0.5,
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="ProductDetails m-8">
            <div className="imageDiv">
              <Carousel navButtonsAlwaysInvisible={true} autoPlay={false}>
                {product?.images?.map((item, i) => (
                  <img
                    className="CarouselImage"
                    key={item.url_id}
                    src={item.url_id}
                    alt={`${i} Slide`}
                  />
                ))}
              </Carousel>
            </div>
            <div className="detailsDiv">
              <div className="detailsBlock-1">
                <h2>{product.name}</h2>
                {/* <p>Product #{product._id}</p> */}
              </div>
              <div className="detailsBlock-2">
                <Rating {...ratingOptions} />
                <span className="productCardSpan ml-2">
                  ({product?.numOfReviews} Reviews)
                </span>
              </div>
              <div className="detailsBlock-3">
                <h1 className="text-xl">${product?.price}</h1>
                <div className="detailsBlock-3-1">
                  <div className="detailsBlock-3-1-1">
                    <button onClick={decreaseQuantity}>-</button>
                    <input
                      type="number"
                      value={quantity}
                      className="w-6 text-center"
                      readOnly
                    />
                    <button onClick={increaseQuantity}>+</button>
                  </div>
                  <button onClick={addToCart}>add to cart</button>
                </div>
                <p>
                  Status :
                  <b
                    className={
                      product.Stock < 1 ? "text-red-600" : "text-green-600"
                    }>
                    {product.Stock < 1 ? " OutOfStock" : " InStock"}
                  </b>
                </p>
              </div>
              <div className="detailsBlock-">
                <span>Descrition:</span>
                <p>{product?.description}</p>
              </div>
              <button>Submit Review</button>
            </div>
          </div>
          <div className="m-8">
            <h1 className="text-2xl">Reviews</h1>
            {product.reviews && product?.reviews[0] ? (
              <div>
                {product.reviews.map((review) => (
                  <ReviewCard review={review} key={review._id} />
                ))}
              </div>
            ) : (
              <p>No Reviews yet</p>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default ProductDetailsPage;
