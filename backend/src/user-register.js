const axios = require("axios");
const Datastore = require("nedb");
const users = new Datastore();

async function registerUser(token, ip) {
  let githubInfo;
  let ipInfo = {};

  try {
    const { status, data } = await axios({
      method: "GET",
      url: `https://api.github.com/user?access_token=${token}`,
      responseType: "json"
    });
    if (status === 200) {
      githubInfo = data;
    }
  } catch (error) {
    console.error(error);
    return;
  }

  try {
    const { status, data } = await axios({
      method: "GET",
      url: `http://geoip.nekudo.com/api/${token}`,
      responseType: "json"
    });
    if (status === 200) {
      ipInfo = data;
    }
  } catch (error) {
    console.error(error);
  }

  users.update(
    { login: githubInfo.login },
    {
      $push: {
        sessions: {
          token,
          startedOn: Date.now(),
          location: ipInfo.country && ipInfo.country.code
        }
      }
    },
    { upsert: true }
  );
}

function logoutUser(token) {
  users.update({}, { $pull: { sessions: { token } } }, {});
}

function saveLog(token, log) {
  users.update(
    { sessions: { $elemMatch: { token } } },
    {
      $push: {
        logs: { ...log, timestamp: Date.now() }
      }
    },
    {}
  );
}

function getLogsForUser(login) {
  return new Promise((resolve, reject) => {
    users.findOne({ login }, function(err, user) {
      if (err) {
        return reject(err);
      }
      resolve(user ? user.logs : []);
    });
  });
}

function getUsers() {
  return new Promise((resolve, reject) => {
    users.find({}, function(err, users) {
      if (err) {
        return reject(err);
      }
      resolve(
        users.map(user => ({
          login: user.login,
          queries: user.logs.length
        }))
      );
    });
  });
}

module.exports = {
  registerUser,
  logoutUser,
  saveLog,
  getLogsForUser,
  getUsers
};
