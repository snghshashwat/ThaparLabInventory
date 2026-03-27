const express = require("express");
const { body } = require("express-validator");
const { googleLogin, getMe, logout } = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");
const { validateRequest } = require("../middleware/validate");
const { authLimiter } = require("../middleware/rateLimiters");

const router = express.Router();

router.post(
  "/google",
  authLimiter,
  [
    body("credential")
      .isString()
      .trim()
      .notEmpty()
      .withMessage("Google credential is required"),
  ],
  validateRequest,
  googleLogin,
);

router.get("/me", authLimiter, authenticate, getMe);
router.post("/logout", authLimiter, authenticate, logout);

module.exports = router;
