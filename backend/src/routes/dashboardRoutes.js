const express = require("express");
const { getDashboardData } = require("../controllers/dashboardController");
const { authenticate } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/authorize");

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorizeRoles("admin", "viewer"),
  getDashboardData,
);

module.exports = router;
