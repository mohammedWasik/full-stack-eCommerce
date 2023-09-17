import express from "express";
import * as dotenv from "dotenv";
import {
  createProduct,
  createProductReview,
  deleteProduct,
  deleteReview,
  getAllProducts,
  getAllReview,
  getSingleProduct,
  updateProduct,
} from "../controllers/productController.js";
import { isAuthenticated, authorizeRoles } from "../middleware/index.js";

dotenv.config();

const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/product/:id").get(getSingleProduct);

/* ------------------------------ admin routes ------------------------------ */
router
  .route("/admin/products/new")
  .post(isAuthenticated, authorizeRoles("admin"), createProduct);
router
  .route("/admin/product/:id")
  .put(isAuthenticated, authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticated, authorizeRoles("admin"), deleteProduct);

/* --------------------------------- review --------------------------------- */
router.route("/review").put(isAuthenticated, createProductReview);
router
  .route("/reviews")
  .get(getAllReview)
  .delete(isAuthenticated, deleteReview);

/* ------------------------------------ d ----------------------------------- */
export default router;
