import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "./User.js";
import Token from "./Token.js";
import { convertErrorMessages } from "../../utils/funtions.js";

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

export const forgotPassword = async (req, res) => {};

export const verifyOTP = async (req, res) => {};

export const resetPassword = async (req, res) => {};
