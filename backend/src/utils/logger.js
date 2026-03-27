function logAction(action, metadata = {}) {
  console.log(
    JSON.stringify({
      level: "info",
      action,
      metadata,
      timestamp: new Date().toISOString(),
    }),
  );
}

module.exports = {
  logAction,
};
