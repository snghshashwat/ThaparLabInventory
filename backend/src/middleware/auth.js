const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const headerToken = authHeader.startsWith("Bearer ")
    ? authHeader.substring(7)
    : null;
  const token = req.cookies.token || headerToken;

  if (!token) {
    return res.status(401).json({
      message:
        "Authentication required. Please sign in with your @thapar.edu account.",
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
      issuer: "thapar-lab-inventory",
      audience: "thapar-lab-frontend",
    });
    req.user = {
      email: payload.email,
      name: payload.name,
      role: payload.role,
      picture: payload.picture || "",
    };

    return next();
  } catch (error) {
    return res.status(401).json({
      message:
        "Session expired or invalid. Please sign in again with your @thapar.edu account.",
    });
  }
}

module.exports = {
  authenticate,
};
