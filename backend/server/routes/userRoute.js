import express from "express";
import * as dotenv from "dotenv";
import {
  deleteUser,
  forgetPassword,
  getAllUser,
  getSingleUser,
  getUserDetail,
  login,
  logout,
  registerUser,
  resetPassword,
  updatePassword,
  updateProfile,
  updateProfileRole,
} from "../controllers/userController.js";
import { isAuthenticated, authorizeRoles } from "../middleware/index.js";

dotenv.config();

const router = express.Router();

/* ------------------------ Register & Login & Logout ----------------------- */
router.route("/register").post(registerUser);
router.route("/login").post(login);
router.route("/logout").get(logout);

/* ------------------------- Password Route Related ------------------------- */
router.route("/password/forgot").post(forgetPassword);
router.route("/password/update").put(isAuthenticated, updatePassword);
router.route("/password/reset/:token").put(resetPassword);

/* ------------------------------ User Profile ------------------------------ */
router.route("/me").get(isAuthenticated, getUserDetail);
router.route("/me/update").put(isAuthenticated, updateProfile);

/* -------------------------------- for admin ------------------------------- */
router
  .route("/admin/users")
  .get(isAuthenticated, authorizeRoles("admin"), getAllUser);
router
  .route("/admin/user/:id")
  .get(isAuthenticated, authorizeRoles("admin"), getSingleUser)
  .put(isAuthenticated, authorizeRoles("admin"), updateProfileRole)
  .delete(isAuthenticated, authorizeRoles("admin"), deleteUser);

export default router;
