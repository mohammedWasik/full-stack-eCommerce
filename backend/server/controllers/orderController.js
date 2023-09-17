import Order from "../database/models/orderModel.js";
import Product from "../database/models/productModel.js";
import { ErrorHandler } from "../utils/index.js";
import { catchAsyncError } from "../middleware/index.js";

/* -------------------------------------------------------------------------- */
//*                              Create new order                              */
/* -------------------------------------------------------------------------- */

export const createNewOrder = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

/* -------------------------------------------------------------------------- */
//*                              get single order                              */
/* -------------------------------------------------------------------------- */

export const getSingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(ErrorHandler(`order not found `, 404));
  }
  res.status(200).json({
    success: true,
    order,
  });
});

/* -------------------------------------------------------------------------- */
//*                        get order for logged in user                        */
/* -------------------------------------------------------------------------- */
export const myOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

/* -------------------------------------------------------------------------- */
//*                             get all order admin                            */
/* -------------------------------------------------------------------------- */
export const getAllOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find().populate("user", "name email");

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    orders,
    totalAmount,
  });
});

/* -------------------------------------------------------------------------- */
//*                        update order status  --admin                       */
/* -------------------------------------------------------------------------- */

export const updateOrderStatus = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(ErrorHandler(`order not found with ${req.params.id}`, 404));
  }
  if (order.orderStatus === "Delivered") {
    return next(ErrorHandler(`you have already delivered this order`, 400));
  }

  order.orderItems.forEach(async (item) => {
    await updateStock(item.product, item.quantity);
  });

  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    order,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.quantity -= quantity;

  await product.save({ validateBeforeSave: false });
}

/* -------------------------------------------------------------------------- */
//*                           delete order -admin                             */
/* -------------------------------------------------------------------------- */

export const deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(ErrorHandler(`order not found with ${req.params.id}`, 404));
  }
  await order.deleteOne();

  res.status(200).json({
    success: true,
    message: "order deleted",
  });
});
