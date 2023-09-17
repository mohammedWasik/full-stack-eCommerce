import express from "express";
import * as dotenv from "dotenv";
import { isAuthenticated, authorizeRoles } from "../middleware/index.js";
import {
  createNewOrder,
  deleteOrder,
  getAllOrders,
  getSingleOrder,
  myOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = express.Router();

/* ---------------------------- create new order ---------------------------- */
router.route("/order/new").post(isAuthenticated, createNewOrder);

/* ------------------------- get  order ------------------------- */
router.route("/order/:id").get(isAuthenticated, getSingleOrder);
router
  .route("/admin/orders")
  .get(isAuthenticated, authorizeRoles("admin"), getAllOrders);
router
  .route("/admin/order/:id")
  .put(isAuthenticated, authorizeRoles("admin"), updateOrderStatus)
  .delete(isAuthenticated, authorizeRoles("admin"), deleteOrder);

/* ------------------------------ get my orders ----------------------------- */
router.route("/orders/me").get(isAuthenticated, myOrders);

export default router;
