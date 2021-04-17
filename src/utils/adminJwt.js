const jwt = require("jsonwebtoken");

function generateAdminJwt() {
  const token = jwt.sign({ isAdmin: true }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
}

module.exports = generateAdminJwt
