const asyncHandler = require("../utils/asyncHandler");
const Component = require("../models/Component");
const Transaction = require("../models/Transaction");

const getDashboardData = asyncHandler(async (req, res) => {
  const { lab } = req.query;
  const query = lab ? { lab } : {};

  const [inventory, recentTransactions, lowStock] = await Promise.all([
    Component.find(query).sort({ name: 1 }),
    Transaction.find(query).sort({ timestamp: -1 }).limit(10),
    Component.find({
      ...query,
      $expr: { $lte: ["$available", "$threshold"] },
    }).sort({ available: 1 }),
  ]);

  res.json({
    inventory,
    recentTransactions,
    lowStock,
  });
});

module.exports = {
  getDashboardData,
};
