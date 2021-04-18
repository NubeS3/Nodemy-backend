const jwt = require("jsonwebtoken");

const adminAuthentication = async (req, res, next) => {
  try {
    let token = req.header("Nodemy-Authentication");
    if (!token || typeof token !== "string") {
      throw new Error();
    }

    token = token.replace("Bearer ", "");

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (decode.user.accountType === 'Admin') {
      req.isAdmin = true;
    }
    else {
      res.status(403).send({
        error: "Please authenticate!",
      });
      return
    }

    req.accessToken = token;
    req.user = {
      email: "admin@nodemy.com",
      fullname: "admin",
      accountHost: "Nodemy",
      password: "!!@!!",
      accountType: "Admin",
    };
    next();
  } catch {
    res.status(403).send({
      error: "Please authenticate!",
    });
  }
};

module.exports = adminAuthentication;
