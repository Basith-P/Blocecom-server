import { validationResult } from "express-validator";

import User from "./User.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorsList = errors.array().map((error) => ({
      field: error.path,
      msg: error.msg,
    }));
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
  console.log("login controller called");
};

export const forgotPassword = async (req, res) => {};

export const verifyOTP = async (req, res) => {};

export const resetPassword = async (req, res) => {};
