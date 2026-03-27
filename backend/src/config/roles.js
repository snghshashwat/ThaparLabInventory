const ADMIN_EMAILS = ["ssingh14_be23@thapar.edu"];
const VIEWER_EMAILS = ["doaa@thapar.edu", "dosa@thapar.edu"];

function getUserRole(email) {
  const normalizedEmail = (email || "").toLowerCase().trim();

  if (ADMIN_EMAILS.includes(normalizedEmail)) {
    return "admin";
  }

  if (VIEWER_EMAILS.includes(normalizedEmail)) {
    return "viewer";
  }

  return null;
}

module.exports = {
  ADMIN_EMAILS,
  VIEWER_EMAILS,
  getUserRole,
};
