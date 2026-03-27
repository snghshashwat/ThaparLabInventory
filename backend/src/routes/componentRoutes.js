const express = require("express");
const { body, param } = require("express-validator");
const {
  getComponents,
  createComponent,
  updateComponent,
  deleteComponent,
  getWarnings,
} = require("../controllers/componentController");
const { authenticate } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/authorize");
const { validateRequest } = require("../middleware/validate");
const { writeLimiter } = require("../middleware/rateLimiters");

const router = express.Router();

const componentValidation = [
  body("name").isString().trim().isLength({ min: 2, max: 120 }),
  body("componentId").isString().trim().isLength({ min: 2, max: 60 }),
  body("available").isInt({ min: 0 }),
  body("totalStock").optional().isInt({ min: 0 }),
  body("threshold").isInt({ min: 0 }),
  body("lab").isString().trim().isLength({ min: 2, max: 80 }),
];

router.use(authenticate);
router.use(authorizeRoles("admin"));

router.get("/warnings", getWarnings);
router.get("/", getComponents);
router.post(
  "/",
  writeLimiter,
  componentValidation,
  validateRequest,
  createComponent,
);
router.put(
  "/:id",
  writeLimiter,
  [param("id").isMongoId(), ...componentValidation],
  validateRequest,
  updateComponent,
);
router.delete(
  "/:id",
  writeLimiter,
  [param("id").isMongoId()],
  validateRequest,
  deleteComponent,
);

module.exports = router;
