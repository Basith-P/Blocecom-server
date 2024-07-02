import { Router } from "express";

const router = Router();

router.post("/login");

router.post("/signup");

router.post("/logout");

router.post("/forgot-password");

router.post("/veify-otp");

router.post("/reset-password");

export default router;
