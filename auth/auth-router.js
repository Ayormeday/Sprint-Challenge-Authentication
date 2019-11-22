const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Users = require("../users/users-model.js");

router.post("/register", validateUserBody, (req, res, next) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 11);
  Users.add({ username, password: hashedPassword })
    .then(user => {
      res.status(201).json({ id: user.id, username: user.username });
    })
    .catch(next);
});

router.post("/login", validateUserBody, (req, res, next) => {
  const { username, password } = req.body;
  Users.getUser({ username })
    .then(user => {
      if (!user) {
        next({ message: "Invalid credentials", status: 401 });
      } else {
        const isValidPassword = bcrypt.compareSync(password, user.password);
        if (!isValidPassword) {
          next({ message: "Invalid credentials", status: 401 });
        } else {
          const token = generateToken(user);
          res.status(200).json({
            message: `Welcome ${user.username}!`,
            token: token
          });
        }
      }
    })
    .catch(next);
});

function validateUserBody(req, res, next) {
  const { username, password } = req.body;
  if (!username || !password) {
    next({
      message: "Missing required `username` and `password` fields",
      status: 401
    });
  } else {
    req.body = { username, password };
    next();
  }
}

//generate token
function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    department: user.department
  };
  const options = {
    expiresIn: "1d"
  };

  const result = jwt.sign(payload, "SECRET", options);

  return result;
}

//error middleware

router.use((error, req, res, next) => {
  res
    .status(error.status || 500)
    .json({
      file: "auth-router",
      method: req.method,
      url: req.url,
      status: error.status || 500,
      message: error.message
    })
    .end();
});

module.exports = router;
