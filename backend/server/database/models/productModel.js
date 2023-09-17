import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product name "],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please enter product description "],
  },
  price: {
    type: Number,
    required: [true, "Please enter product price "],
    maxLength: [8, "Price is out of aukad!!"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url_id: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "please enter product category"],
  },
  quantity: {
    type: Number,
    required: [true, "please enter product category"],
    maxLength: [5, "stock cannot exceed 5"],
    default: 1,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: [true],
      },
      rating: {
        type: Number,
        required: [true],
      },
      comment: {
        type: String,
        required: [true],
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const productModel = mongoose.model("Product", productSchema);

export default productModel;
