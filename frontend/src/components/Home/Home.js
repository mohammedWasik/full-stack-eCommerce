import React, { Fragment, useEffect } from "react";
import "./Home.css";
import { CgScrollV } from "react-icons/cg";
import ProductCard from "./ProductCard.js";
import MetaData from "../layout/MetaData";
import { clearErrors, getProduct } from "../../actions/productActions";
import { useAlert } from "react-alert";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../Loader/Loader";

const Home = () => {
  const alert = useAlert();
  const dispatch = useDispatch();

  const { loading, error, products } = useSelector((state) => state.products);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct());
  }, [dispatch, error, alert]);

  return (
    <Fragment>
      <MetaData title={"Random Shop"} />
      <div className="banner mb-60">
        <p className="text-5xl font-semibold text-white tracking-widest">
          Welcome To Random sShop
        </p>
        <h1 className="text-3xl tracking-widest">
          Find amazing products below
        </h1>
        <a href="#container">
          <div className="button-div">
            <button className="text-6xl">
              <CgScrollV />
            </button>
          </div>
        </a>
      </div>

      <Fragment>
        {loading ? (
          <Loader />
        ) : (
          <div className="container" id="container">
            <h2 className="homeHeading uppercase text-center text-4xl tracking-wide font-bold m-5 text-gray-500">
              Featured Products
            </h2>

            <div className="flex flex-wrap justify-between">
              {products?.map((product) => (
                <ProductCard key={product?._id} product={product} />
              ))}
            </div>
          </div>
        )}
      </Fragment>
    </Fragment>
  );
};

export default Home;
