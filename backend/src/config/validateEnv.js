const REQUIRED_ENV_VARS = ["MONGO_URI", "JWT_SECRET", "GOOGLE_CLIENT_ID"];

function validateEnv() {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }

  const jwtSecret = (process.env.JWT_SECRET || "").trim();
  if (jwtSecret.length < 32 || jwtSecret.includes("replace_with")) {
    throw new Error(
      "JWT_SECRET must be at least 32 characters and not use a placeholder value.",
    );
  }
}

module.exports = validateEnv;
