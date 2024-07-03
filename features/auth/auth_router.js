import { Router } from "express";

import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  verifyToken,
  verifyPasswordOTP,
} from "./controller.js";
import { resetPasswordValidator, signupValidator } from "./validator.js";

const router = Router();

router.post("/signup", signupValidator, signup);

router.post("/login", login);

router.get("/verify-token", verifyToken);

router.post("/forgot-password", forgotPassword);

router.post("/veify-otp", verifyPasswordOTP);

router.post("/reset-password", resetPasswordValidator, resetPassword);

export default router;
