const jwt = require("jsonwebtoken");

// ************************************************************
// MiddleWare Authentication Function for Private Routes
module.exports = function (req, res, next) {
  const token = req.header("authToken");

  if (!token) {
    res.send("Access Denied");
  } else {
    try {
      const verified = jwt.verify(token, "tokensecretstring");
      req.user = verified;
      next();
    } catch (error) {
      res.send("Error");
    }
  }
};
