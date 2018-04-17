const { saveLog, getUsers, getLogsForUser } = require("./user-register");

const logPostHandler = (req, res) => {
  const body = JSON.parse(req.body);
  saveLog(body.id, body.metaData);
  res.sendStatus(204);
};

const logUsersGetHandler = async (req, res) => {
  const logs = await getUsers();
  res.json(logs);
};

const logUserGetHandler = async (req, res) => {
  const logs = await getLogsForUser(req.params.id);
  res.json(logs);
};

module.exports = { logUsersGetHandler, logUserGetHandler, logPostHandler };
