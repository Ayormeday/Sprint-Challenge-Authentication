const router = require("express").Router();
const Users = require("./users-model.js");
const authenticate = require("../auth/authenticate-middleware");

router.get("/", authenticate, validateUserId, (req, res) => {
  Users.getUsers({ username: req.loggedInUser.username })
    .then(users => {
      if (users) {
        res.status(200).json(users);
      } else {
        res.json({
          message: "Access Denied!!!"
        });
      }
    })
    .catch(err => {
      res.send(err);
    });
});

router.get("/:id", authenticate, validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.put("/:id", validateUserId, validateUserBody, (req, res, next) => {
  Users.update(req.body, req.user.id)
    .then(updatedScheme => {
      res.status(200).json(updatedScheme);
    })
    .catch(next);
});

router.delete("/:id", validateUserId, (req, res, next) => {
  Users.remove(req.user.id)
    .then(() => {
      res.status(204).json(req.user);
    })
    .catch(next);
});

//validation middleware
function validateUserId(req, res, next) {
  const { id } = req.params;
  let validId = Number(id);
  if (!Number.isInteger(validId) && validId > 0) {
    next({ message: "Invalid user id" });
  }
  Users.getUser({ id: validId })
    .then(user => {
      if (user) {
        req.user = user;
        next();
      } else {
        next({ message: "Could not find user with given id", status: 404 });
      }
    })
    .catch(next);
}
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

//error middleware
router.use((error, req, res, next) => {
  res
    .status(error.status || 500)
    .json({
      file: "user-router",
      method: req.method,
      url: req.url,
      status: error.status || 500,
      message: error.message
    })
    .end();
});

module.exports = router;
