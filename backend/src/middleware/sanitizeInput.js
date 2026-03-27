function sanitizeMongoKeys(value) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      value[index] = sanitizeMongoKeys(item);
    });
    return value;
  }

  if (value && typeof value === "object") {
    Object.keys(value).forEach((key) => {
      if (key.startsWith("$") || key.includes(".")) {
        delete value[key];
        return;
      }

      value[key] = sanitizeMongoKeys(value[key]);
    });
  }

  return value;
}

function sanitizeInput(req, res, next) {
  if (req.body) {
    sanitizeMongoKeys(req.body);
  }

  if (req.params) {
    sanitizeMongoKeys(req.params);
  }

  if (req.query) {
    sanitizeMongoKeys(req.query);
  }

  next();
}

module.exports = sanitizeInput;
