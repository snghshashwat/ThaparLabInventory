const mongoose = require("mongoose");

const componentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    componentId: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    available: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    totalStock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    lab: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    threshold: {
      type: Number,
      required: true,
      min: 0,
      default: 5,
    },
    belowThresholdSince: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

componentSchema.index({ componentId: 1, lab: 1 }, { unique: true });

module.exports = mongoose.model("Component", componentSchema);
