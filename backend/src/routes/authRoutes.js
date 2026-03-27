const express = require("express");
const { body } = require("express-validator");
const { googleLogin, getMe, logout } = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");
const { validateRequest } = require("../middleware/validate");

const router = express.Router();

router.post(
  "/google",
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

router.get("/me", authenticate, getMe);
router.post("/logout", authenticate, logout);

module.exports = router;
