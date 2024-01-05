const jwt = require("jsonwebtoken");
require("dotenv").config();
const checkForAdminMiddleware = (req, res, next) => {
  if (req.headers.auth) {
    const decode = jwt.verify(req.headers.auth, `${process.env.private_key}`);
    if (decode.role == "admin") return next();
  }
  return res.status(500).json({
    message: "U are not a Admin",
  });
};
module.exports = { checkForAdminMiddleware };
