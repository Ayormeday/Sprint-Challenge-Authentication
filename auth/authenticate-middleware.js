/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, "THIS IS THE SECRET", (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: err.message });
      } else {
        req.loggedInUser = decodedToken;
        next();
      }
    });
  } else {
    res.status(400).json({ message: "you shall not pass!" });
  }
};
