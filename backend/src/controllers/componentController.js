const asyncHandler = require("../utils/asyncHandler");
const Component = require("../models/Component");
const { logAction } = require("../utils/logger");

const getComponents = asyncHandler(async (req, res) => {
  const { lab } = req.query;
  const query = lab ? { lab } : {};

  const components = await Component.find(query).sort({ name: 1 });

  res.json({ components });
});

const createComponent = asyncHandler(async (req, res) => {
  const component = await Component.create({
    name: req.body.name,
    componentId: req.body.componentId,
    available: req.body.available,
    threshold: req.body.threshold,
    lab: req.body.lab,
  });

  logAction("component.create", {
    componentId: component.componentId,
    lab: component.lab,
    by: req.user.email,
  });

  res.status(201).json({ component });
});

const updateComponent = asyncHandler(async (req, res) => {
  const component = await Component.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      componentId: req.body.componentId,
      available: req.body.available,
      threshold: req.body.threshold,
      lab: req.body.lab,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!component) {
    return res.status(404).json({ message: "Component not found" });
  }

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

module.exports = {
  getComponents,
  createComponent,
  updateComponent,
  deleteComponent,
};
