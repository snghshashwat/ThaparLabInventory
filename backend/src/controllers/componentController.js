const asyncHandler = require("../utils/asyncHandler");
const Component = require("../models/Component");
const { logAction } = require("../utils/logger");

function applyThresholdState(component) {
  if (component.available <= component.threshold) {
    component.belowThresholdSince = component.belowThresholdSince || new Date();
  } else {
    component.belowThresholdSince = null;
  }
}

const getComponents = asyncHandler(async (req, res) => {
  const { lab } = req.query;
  const query = lab ? { lab } : {};

  const components = await Component.find(query).sort({ name: 1 });

  res.json({ components });
});

const createComponent = asyncHandler(async (req, res) => {
  const available = Number(req.body.available);
  const totalStock = Number(req.body.totalStock ?? req.body.available);

  if (!Number.isFinite(available) || available < 0) {
    return res
      .status(400)
      .json({ message: "Available stock must be 0 or higher" });
  }

  if (!Number.isFinite(totalStock) || totalStock < 0) {
    return res.status(400).json({ message: "Total stock must be 0 or higher" });
  }

  if (available > totalStock) {
    return res.status(400).json({
      message: "Available stock cannot be greater than total stock",
    });
  }

  const component = await Component.create({
    name: req.body.name,
    componentId: req.body.componentId,
    available,
    totalStock,
    threshold: req.body.threshold,
    lab: req.body.lab,
    belowThresholdSince:
      available <= Number(req.body.threshold) ? new Date() : null,
  });

  logAction("component.create", {
    componentId: component.componentId,
    lab: component.lab,
    by: req.user.email,
  });

  res.status(201).json({ component });
});

const updateComponent = asyncHandler(async (req, res) => {
  const available = Number(req.body.available);
  const totalStock = Number(req.body.totalStock ?? req.body.available);

  if (!Number.isFinite(available) || available < 0) {
    return res
      .status(400)
      .json({ message: "Available stock must be 0 or higher" });
  }

  if (!Number.isFinite(totalStock) || totalStock < 0) {
    return res.status(400).json({ message: "Total stock must be 0 or higher" });
  }

  if (available > totalStock) {
    return res.status(400).json({
      message: "Available stock cannot be greater than total stock",
    });
  }

  const component = await Component.findById(req.params.id);

  if (!component) {
    return res.status(404).json({ message: "Component not found" });
  }

  component.name = req.body.name;
  component.componentId = req.body.componentId;
  component.available = available;
  component.totalStock = totalStock;
  component.threshold = Number(req.body.threshold);
  component.lab = req.body.lab;
  applyThresholdState(component);

  await component.save();

  logAction("component.update", {
    componentId: component.componentId,
    lab: component.lab,
    by: req.user.email,
  });

  res.json({ component });
});

const deleteComponent = asyncHandler(async (req, res) => {
  const component = await Component.findByIdAndDelete(req.params.id);

  if (!component) {
    return res.status(404).json({ message: "Component not found" });
  }

  logAction("component.delete", {
    componentId: component.componentId,
    lab: component.lab,
    by: req.user.email,
  });

  res.json({ message: "Component deleted" });
});

const getWarnings = asyncHandler(async (req, res) => {
  const { lab } = req.query;
  const query = {
    $expr: { $lte: ["$available", "$threshold"] },
  };

  if (lab) {
    query.lab = lab;
  }

  const warningsRaw = await Component.find(query).sort({
    lab: 1,
    available: 1,
  });

  const warnings = warningsRaw.map((item) => ({
    ...item.toObject(),
    belowThresholdSince:
      item.belowThresholdSince || item.updatedAt || item.createdAt,
  }));

  res.json({ warnings });
});

module.exports = {
  getComponents,
  createComponent,
  updateComponent,
  deleteComponent,
  getWarnings,
};
