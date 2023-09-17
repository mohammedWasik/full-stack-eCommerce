import React from "react";
import { Rating } from "@mui/material";
import profilePng from "../../images/Profile.png";

const ReviewCard = ({ review }) => {
  const options = {
    value: review?.rating,
    readOnly: true,
    precision: 0.5,
  };
  return (
    <div>
      <img src={profilePng} alt="user" className="w-16" />
      <p>{review.name}</p>
      <Rating {...options} />
      <p>{review.comment}</p>
    </div>
  );
};

export default ReviewCard;
