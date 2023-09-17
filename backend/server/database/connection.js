import mongoose from "mongoose";

const connectDB = (url) => {
  mongoose.set("strictQuery", true);

  mongoose
    .connect(url)
    .then((data) => console.log(`mongodb connected ${data.connection.host}`));
};

export default connectDB;
