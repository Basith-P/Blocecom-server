import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "./User.js";
import Token from "./Token.js";
import { convertErrorMessages } from "../../utils/funtions.js";
import { sendMail } from "../../helpers/email_sender.js";

export const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorsList = convertErrorMessages(errors);
    return res.status(400).json({ errors: errorsList });
  }

  const { password } = req.body;

  let user = new User({
    ...req.body,
    passWordHash: bcrypt.hashSync(password, 8),
  });

  user = await user.save();
  if (!user) return res.status(400).json({ error: "User not created" });

  return res.status(201).json({ data: user });
};
export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorsList = convertErrorMessages(errors);
    return res.status(400).json({ errors: errorsList });
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(404).json({ error: "User with this email not found" });

  const passwordIsValid = bcrypt.compareSync(password, user.passWordHash);
  if (!passwordIsValid)
    return res.status(401).json({ error: "Invalid password" });

  const accessToken = jwt.sign(
    { id: user.id, isAdmin: user.isAdmin },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  const refreshToken = jwt.sign(
    { id: user.id, isAdmin: user.isAdmin },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "28d" }
  );

  const existingToken = await Token.findOne({ user: user.id });
  if (existingToken) await existingToken.deleteOne();

  const token = new Token({
    user: user.id,
    accessToken,
    refreshToken,
    expiry: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
  });
  await token.save();

  return res.status(200).json({ user, accessToken, refreshToken });
};

export const verifyToken = async (req, res) => {
  const accessToken = req.headers.authorization.split(" ")[1];
  if (!accessToken)
    return res.status(401).json({ error: "Access token not found" });

  const token = await Token.findOne({ accessToken });
  if (!token) return res.status(404).json({ error: "Token not found" });

  const tokenData = jwt.decode(token.refreshToken);
  const user = await User.findById(tokenData.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  const isValid = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  if (isValid) return res.status(200).json({ isValid, user, accessToken });

  const isRefreshTokenValid = jwt.verify(
    token.refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  if (!isRefreshTokenValid)
    return res.status(401).json({ error: "Invalid refresh token" });

  const newAccessToken = jwt.sign(
    { id: user.id, isAdmin: user.isAdmin },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  token.accessToken = newAccessToken;
  token.expiry = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);
  await token.save();

  return res.status(200).json({ user, accessToken: newAccessToken });
};

export const forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorsList = convertErrorMessages(errors);
    return res.status(400).json({ errors: errorsList });
  }

  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found" });

  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

  user.resetPasswordOtp = otp;
  user.resetPasswordExpires = new Date(new Date().getTime() + 10 * 60000); // 10 minutes
  await user.save();

  await sendMail(
    email,
    "Reset Password OTP",
    `Your OTP for resetting password on Blocecom is ${otp}`
  );

  return res.status(200).json({ message: "OTP sent to email" });
};

export const verifyOTP = async (req, res) => {};

export const resetPassword = async (req, res) => {};
