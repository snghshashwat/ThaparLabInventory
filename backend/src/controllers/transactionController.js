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

const getStudentHoldings = asyncHandler(async (req, res) => {
  const studentRollRaw = String(req.params.studentRoll || "").trim();

  if (!studentRollRaw) {
    return res.status(400).json({ message: "Student roll is required" });
  }

  const escapedRoll = studentRollRaw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const rollRegex = new RegExp(`^${escapedRoll}$`, "i");

  const transactions = await Transaction.find({ studentRoll: rollRegex }).sort({
    timestamp: 1,
  });

  const holdingsMap = new Map();

  for (const transaction of transactions) {
    for (const item of transaction.items) {
      const key = `${transaction.lab}::${item.componentId}`;
      const existing = holdingsMap.get(key) || {
        lab: transaction.lab,
        componentId: item.componentId,
        name: item.name,
        issueBatches: [],
      };

      const qty = Number(item.qty || 0);

      if (transaction.type === "take") {
        existing.issueBatches.push({
          qty,
          issuedAt: transaction.timestamp,
        });
      } else {
        let remainingToReturn = qty;

        while (remainingToReturn > 0 && existing.issueBatches.length > 0) {
          const firstBatch = existing.issueBatches[0];
          const consumed = Math.min(firstBatch.qty, remainingToReturn);
          firstBatch.qty -= consumed;
          remainingToReturn -= consumed;

          if (firstBatch.qty <= 0) {
            existing.issueBatches.shift();
          }
        }
      }

      holdingsMap.set(key, existing);
    }
  }

  const positiveHoldings = [...holdingsMap.values()]
    .map((item) => {
      const qty = item.issueBatches.reduce((sum, batch) => sum + batch.qty, 0);
      return {
        lab: item.lab,
        componentId: item.componentId,
        name: item.name,
        qty,
        issuedOn: item.issueBatches[0]?.issuedAt || null,
        issueDates: item.issueBatches.map((batch) => ({
          qty: batch.qty,
          issuedAt: batch.issuedAt,
        })),
      };
    })
    .filter((item) => item.qty > 0)
    .sort((a, b) => a.lab.localeCompare(b.lab) || a.name.localeCompare(b.name));

  const groupedByLab = positiveHoldings.reduce((acc, item) => {
    if (!acc[item.lab]) {
      acc[item.lab] = [];
    }
    acc[item.lab].push(item);
    return acc;
  }, {});

  const labs = Object.entries(groupedByLab).map(([lab, items]) => ({
    lab,
    items,
  }));

  const totalItems = positiveHoldings.reduce((sum, item) => sum + item.qty, 0);
  const message =
    totalItems === 0
      ? "No holdings right now for this student."
      : "Holdings fetched successfully.";

  res.json({
    studentRoll: studentRollRaw,
    labs,
    totalItems,
    transactionCount: transactions.length,
    message,
  });
});

module.exports = {
  createTransaction,
  getTransactions,
  getStudentHoldings,
};
