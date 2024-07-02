import { Router } from "express";
import {
  forgotPassword,
  login,
  resetPassword,
  signup,
  verifyOTP,
} from "./controller.js";
import { signupValidator } from "./validator.js";

const router = Router();

router.post("/signup", signupValidator, signup);

router.post("/login", login);

router.post("/forgot-password", forgotPassword);

router.post("/veify-otp", verifyOTP);

router.post("/reset-password", resetPassword);

export default router;
