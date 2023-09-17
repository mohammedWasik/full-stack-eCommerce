import * as dotenv from "dotenv";
import express from "express";
import { productRoute, userRoute, orderRoute } from "./routes/index.js";
import connectDB from "./database/connection.js";
import { error } from "./middleware/index.js";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";

dotenv.config({ path: "server/config/.env" });

/* -------------------------------------------------------------------------- */
//*                          uncaught exception  error                         */
/* -------------------------------------------------------------------------- */
process.on("uncaughtException", (err) => {
  console.log(`Error : ${err.message}`);
  console.log(`Uncaught Exception Error found, shutting down server`);
  process.exit(1);
});

/* -------------------------------------------------------------------------- */
//?                                 express use                                */
/* -------------------------------------------------------------------------- */
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

/* -------------------------------------------------------------------------- */
//*                                   routes                                   */
/* -------------------------------------------------------------------------- */
app.use("/api/v1", productRoute);
app.use("/api/v1/", userRoute);
app.use("/api/v1/", orderRoute);

/* -------------------------------------------------------------------------- */
//*                            middleware for error                            */
/* -------------------------------------------------------------------------- */
app.use(error);

/* -------------------------------------------------------------------------- */
//*                             connect to database                            */
/* -------------------------------------------------------------------------- */
const PORT = process.env.PORT || 4000;
connectDB(process.env.DB_URI);

const startServer = app.listen(PORT, () =>
  console.log(`Server started on port ${PORT}`)
);

/* -------------------------------------------------------------------------- */
//*                                 cloudianry                                 */
/* -------------------------------------------------------------------------- */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

/* -------------------------------------------------------------------------- */
//*                      unhandled promise rejection error                     */
/* -------------------------------------------------------------------------- */
process.on("unhandledRejection", (err) => {
  console.log(`Error ${err.message}`);
  console.log(`Unhandled Promise Rejection Error found, shutting down server`);

  startServer.close(() => {
    process.exit(1);
  });
});
