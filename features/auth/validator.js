import { body } from "express-validator";

export const signupValidator = [
  body("name")
    .isString()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be between 3 and 50 characters"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 6 characters long")
    .isStrongPassword()
    .withMessage(
      "Password must contain at least 1 lowercase, 1 uppercase, 1 number and 1 special character"
    ),
  body("phone").isMobilePhone().withMessage("Invalid phone number"),
];
