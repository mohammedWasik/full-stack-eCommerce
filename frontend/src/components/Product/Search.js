import React, { Fragment, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const navigate = useNavigate();
  const searchRef = useRef();
  const searchSubmitHandler = (e) => {
    e.preventDefault();
    const term = searchRef.current.value;
    if (term.trim()) {
      navigate(`/products/${term}`);
    } else {
      navigate("/products");
    }
  };
  return (
    <Fragment>
      <form onSubmit={searchSubmitHandler}>
        <input
          type="text"
          placeholder="Search For a Product ... "
          ref={searchRef}
        />
        <button>Search</button>{" "}
      </form>
    </Fragment>
  );
};

export default Search;
