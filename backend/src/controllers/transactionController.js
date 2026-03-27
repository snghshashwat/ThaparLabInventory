const mongoose = require("mongoose");
const asyncHandler = require("../utils/asyncHandler");
const Component = require("../models/Component");
const Transaction = require("../models/Transaction");
const { logAction } = require("../utils/logger");

const createTransaction = asyncHandler(async (req, res) => {
  const { studentRoll, items, type, lab } = req.body;

  const uniqueComponentIds = [
    ...new Set(items.map((item) => item.componentId.toUpperCase())),
  ];
  const session = await mongoose.startSession();

  try {
    let transaction;

    await session.withTransaction(async () => {
      const components = await Component.find({
        componentId: { $in: uniqueComponentIds },
        lab,
      }).session(session);

      const componentMap = new Map(
        components.map((component) => [
          component.componentId.toUpperCase(),
          component,
        ]),
      );

      for (const item of items) {
        const componentId = item.componentId.toUpperCase();
        const component = componentMap.get(componentId);

        if (!component) {
          const error = new Error(
            `Component ${componentId} not found in selected lab`,
          );
          error.statusCode = 400;
          throw error;
        }

        if (type === "take" && component.available < item.qty) {
          const error = new Error(
            `Insufficient stock for ${component.name}. Available: ${component.available}`,
          );
          error.statusCode = 400;
          throw error;
        }

        if (type === "take") {
          component.available -= item.qty;
        } else {
          component.available += item.qty;
        }

        await component.save({ session });
      }

      transaction = await Transaction.create(
        [
          {
            studentRoll,
            items: items.map((item) => ({
              componentId: item.componentId.toUpperCase(),
              name: item.name,
              qty: item.qty,
            })),
            type,
            lab,
            doneBy: req.user.email,
            timestamp: new Date(),
          },
        ],
        { session },
      );
    });

    logAction("transaction.create", {
      type,
      studentRoll,
      itemCount: items.length,
      lab,
      by: req.user.email,
    });

    res.status(201).json({ transaction: transaction[0] });
  } finally {
    await session.endSession();
  }
});

const getTransactions = asyncHandler(async (req, res) => {
  const { lab, limit = 30 } = req.query;
  const query = lab ? { lab } : {};

  const transactions = await Transaction.find(query)
    .sort({ timestamp: -1 })
    .limit(Math.min(Number(limit) || 30, 100));

  res.json({ transactions });
});

module.exports = {
  createTransaction,
  getTransactions,
};
