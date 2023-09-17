import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// import * as dotenv from "dotenv";
// dotenv.config();

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name Cannot Except 30 charecters"],
    minLength: [5, "Name has to be atleast 5 charecter"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validate: [validator.isEmail, "Please enter valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [8, "Name has to be atleast 8 charecters"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url_id: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

/* -------------------------------------------------------------------------- */
//*                             password encryption                            */
/* -------------------------------------------------------------------------- */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

/* -------------------------------------------------------------------------- */
//*                                  jwt token                                 */
/* -------------------------------------------------------------------------- */
userSchema.methods.getJWTToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

/* -------------------------------------------------------------------------- */
//*                             compare Password                             */
/* -------------------------------------------------------------------------- */
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

/* -------------------------------------------------------------------------- */
//*                       generating password reset token                      */
/* -------------------------------------------------------------------------- */
userSchema.methods.getResetPassToken = async function () {
  /* ------------------------- generating random token ------------------------ */
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

const userModel = mongoose.model("User", userSchema);

export default userModel;
