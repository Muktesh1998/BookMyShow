const userModel = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const emailHelper = require("../utils/emailHelper");

const registerUser = async (req, res, next) => {
  try {
    const userExists = await userModel.findOne({ email: req?.body?.email });
    if (userExists) {
      return res.send({
        success: false,
        message: "User Already Exists",
      });
    }
    // hashing usecase
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req?.body?.password, salt);
    console.log("hashed password: ", hashedPassword);
    req.body.password = hashedPassword;
    const newUser = new userModel(req?.body);
    await newUser.save();
    res.send({
      success: true,
      message: "Registration Successfull, Please Login",
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    res.clearCookie("bms_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    res.send({ success: true, message: "Logged out" });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const user = await userModel.findOne({ email: req?.body?.email });

    if (!user) {
      return res.send({
        success: false,
        message: "User does not exist. Please register",
      });
    }

    const validatePassword = await bcrypt.compare(
      req?.body?.password,
      user?.password
    );

    if (!validatePassword) {
      return res.send({
        success: false,
        message: "please enter valid password",
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );
    // Issue httpOnly cookie for cookie-based auth
    res.cookie("bms_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });
    res.send({
      success: true,
      message: "You've successfully Logged In",
      data: token,
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

const currentUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId).select("-password");
    res.send({
      success: true,
      message: "User Details Fetched Successfully",
      data: user,
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (email == undefined) {
      return res.status(401).json({
        status: "false",
        message: "Please enter the email for forget Password",
      });
    }
    let user = await userModel.findOne({ email: email });
    if (user == null) {
      return res.status(404).json({
        status: false,
        message: "user not found",
      });
    } else if (user?.otp != undefined && user.otp < user?.otpExpiry) {
      return res.json({
        success: false,
        message: "Please use otp sent on mail",
      });
    }
    const otp = Math.floor(Math.random() * 10000 + 90000);
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();
    await emailHelper("otp.html", user.email, {
      name: user.name,
      otp: otp,
    });
    res.send({
      success: true,
      message: "Otp has been sent",
    });
  } catch (err) {
    res.status(400);
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { password, otp } = req.body;
    if (password == undefined || otp == undefined) {
      return res.status(401).json({
        success: false,
        message: "invalid request",
      });
    }
    const user = await userModel.findOne({ otp: otp });
    if (user == null) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }
    if (Date.now() > user.otpExpiry) {
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save();
      return res.status(401).json({
        success: false,
        message: "otp expired",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req?.body?.password, salt);
    // convert this logic into findByIdAndUpdate
    // considering we should not set vaules as undefined
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    res.send({
      success: true,
      message: "Password reset has been done successfully",
    });
  } catch (err) {
    res.status(400);
    next(err);
  }
};

// Two-Factor Authentication (Email OTP)
const login2faInit = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.send({ success: false, message: "User does not exist. Please register" });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.send({ success: false, message: "please enter valid password" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();
    await emailHelper("otp.html", user.email, { name: user.name, otp });
    res.send({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

const login2faVerify = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.send({ success: false, message: "User not found" });
    if (!user.otp || !user.otpExpiry) {
      return res.send({ success: false, message: "OTP not initiated" });
    }
    if (Date.now() > user.otpExpiry) {
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save();
      return res.send({ success: false, message: "OTP expired" });
    }
    if (String(user.otp) !== String(otp)) {
      return res.send({ success: false, message: "Invalid OTP" });
    }
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );
    res.cookie("bms_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });
    res.send({ success: true, message: "2FA verification successful", data: token });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  currentUser,
  forgetPassword,
  resetPassword,
  logoutUser,
  login2faInit,
  login2faVerify,
};
