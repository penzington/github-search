const { logoutUser } = require("./user-register");

const logoutHandler = (req, res) => {
  logoutUser(req.params.id);
  res.sendStatus(204);
};

module.exports = logoutHandler;
