const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const asyncHandler = require("../utils/asyncHandler");
const { getUserRole } = require("../config/roles");
const { logAction } = require("../utils/logger");

const oauthClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const allowedGoogleDomain = (process.env.ALLOWED_GOOGLE_DOMAIN || "thapar.edu")
  .toLowerCase()
  .trim();

function cookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 8 * 60 * 60 * 1000,
  };
}

function createToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "8h",
  });
}

const googleLogin = asyncHandler(async (req, res) => {
  const { credential } = req.body;

  const ticket = await oauthClient.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload || !payload.email || !payload.email_verified) {
    return res.status(401).json({
      message:
        "Google sign-in failed. Please use your @thapar.edu Google account.",
    });
  }

  const email = payload.email.toLowerCase().trim();

  if (!email.endsWith(`@${allowedGoogleDomain}`)) {
    logAction("auth.denied_domain", { email, allowedGoogleDomain });
    return res.status(403).json({
      message: `Access denied: this system only allows @${allowedGoogleDomain} accounts.`,
    });
  }

  const role = getUserRole(email);

  if (!role) {
    logAction("auth.denied", { email });
    return res.status(403).json({
      message:
        "Access denied: your @thapar.edu account is not whitelisted for this system.",
    });
  }

  const user = {
    email,
    name: payload.name || email,
    picture: payload.picture || "",
    role,
  };

  const token = createToken(user);

  res.cookie("token", token, cookieOptions());

  logAction("auth.login", { email, role });

  res.json({
    message: "Login successful",
    user,
  });
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", cookieOptions());

  logAction("auth.logout", { email: req.user?.email || "unknown" });

  res.json({ message: "Logged out" });
});

const getMe = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

module.exports = {
  googleLogin,
  logout,
  getMe,
};
