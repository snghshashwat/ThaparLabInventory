const express = require("express");
const { body, param } = require("express-validator");
const {
  createTransaction,
  getTransactions,
  getStudentHoldings,
} = require("../controllers/transactionController");
const { authenticate } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/authorize");
const { validateRequest } = require("../middleware/validate");
const { writeLimiter } = require("../middleware/rateLimiters");

const router = express.Router();

const transactionValidation = [
  body("studentRoll").isString().trim().isLength({ min: 2, max: 60 }),
  body("type").isIn(["take", "return"]),
  body("lab").isString().trim().isLength({ min: 2, max: 80 }),
  body("items").isArray({ min: 1 }),
  body("items.*.componentId").isString().trim().isLength({ min: 2, max: 60 }),
  body("items.*.name").isString().trim().isLength({ min: 1, max: 120 }),
  body("items.*.qty").isInt({ min: 1 }),
];

router.use(authenticate);
router.use(authorizeRoles("admin"));

router.get(
  "/student/:studentRoll/holdings",
  [param("studentRoll").isString().trim().isLength({ min: 2, max: 60 })],
  validateRequest,
  getStudentHoldings,
);
router.get("/", getTransactions);
router.post(
  "/",
  writeLimiter,
  transactionValidation,
  validateRequest,
  createTransaction,
);

module.exports = router;
