const mongoose = require("mongoose");

const transactionItemSchema = new mongoose.Schema(
  {
    componentId: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    qty: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false },
);

const transactionSchema = new mongoose.Schema(
  {
    studentRoll: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    items: {
      type: [transactionItemSchema],
      validate: [(items) => items.length > 0, "At least one item is required"],
      required: true,
    },
    type: {
      type: String,
      enum: ["take", "return"],
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    lab: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    doneBy: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Transaction", transactionSchema);
