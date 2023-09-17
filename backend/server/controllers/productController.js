import Product from "../database/models/productModel.js";
import { ErrorHandler, ApiFeatures } from "../utils/index.js";
import { catchAsyncError } from "../middleware/index.js";
import cloudinary from "cloudinary";

/* -------------------------------------------------------------------------- */
//*                           create product --ADMIN                           */
/* -------------------------------------------------------------------------- */
export const createProduct = catchAsyncError(async (req, res, next) => {
  req.body.user = req.user.id;

  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

/* -------------------------------------------------------------------------- */
//*                              get all products                              */
/* -------------------------------------------------------------------------- */
export const getAllProducts = catchAsyncError(async (req, res, next) => {
  
  const resultPerPage = 8;
  const productsCount = await Product.countDocuments();

  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();

  let products = await apiFeature.query;
  let filteredProductsCount = products.length;

  apiFeature.pagination(resultPerPage);

  products = await apiFeature.query.clone();

  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  });
});
/* -------------------------------------------------------------------------- */
//*                             get single product                             */
/* -------------------------------------------------------------------------- */
export const getSingleProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(ErrorHandler("product not found aikhane", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

/* -------------------------------------------------------------------------- */
//*                           update products -admin                           */
/* -------------------------------------------------------------------------- */
export const updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(ErrorHandler("product not found", 404));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    product,
  });
});

/* -------------------------------------------------------------------------- */
//*                               delete product                               */
/* -------------------------------------------------------------------------- */
export const deleteProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(ErrorHandler("product not found", 404));
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product Delete Successfully",
  });
});

/* -------------------------------------------------------------------------- */
//*                          Create and update review                          */
/* -------------------------------------------------------------------------- */

export const createProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productID } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  const product = await Product.findById(productID);

  const isReviewed = product.reviews.find(
    (review) => review.user.toString() === req.user._id.toString()
  );
  if (isReviewed) {
    product.reviews.forEach((review) => {
      if (review.user.toString() === req.user._id.toString()) {
        review.rating = rating;
        review.comment = comment;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }
  let average = 0;

  product.reviews.forEach((rev) => {
    average += rev.rating;
  });
  product.ratings = average / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

/* -------------------------------------------------------------------------- */
//*                               get all review                              */
/* -------------------------------------------------------------------------- */

export const getAllReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(ErrorHandler(`product not found`, 404));
  }
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

/* -------------------------------------------------------------------------- */
//*                               delete  review                               */
/* -------------------------------------------------------------------------- */
export const deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productID);

  if (!product) {
    return next(ErrorHandler(`product not found`, 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let average = 0;

  reviews.forEach((rev) => {
    average += rev.rating;
  });

  const ratings = reviews.length === 0 ? 0 : average / reviews.length;

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productID,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
