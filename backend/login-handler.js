require("dotenv").config();
const querystring = require("querystring");
const axios = require("axios");
const uid = require("uid-promise");
const { registerUser } = require("./user-register");

const states = [];

const redirectWithQueryString = (res, data) => {
  const location = `${process.env.REDIRECT_URL}?${querystring.stringify(data)}`;
  res.redirect(302, location);
};

const loginHandler = async (req, res) => {
  const state = await uid(20);
  states.push(state);
  res.redirect(
    302,
    `https://github.com/login/oauth/authorize?client_id=${
      process.env.GH_CLIENT_ID
    }&state=${state}`
  );
};

const getClientToken = code =>
  axios({
    method: "POST",
    url: `https://github.com/login/oauth/access_token`,
    responseType: "json",
    data: {
      client_id: process.env.GH_CLIENT_ID,
      client_secret: process.env.GH_CLIENT_SECRET,
      code
    }
  });

const callbackHandler = async (req, res) => {
  res.setHeader("Content-Type", "text/html");
  const { code, state } = req.query;

  if (!code && !state) {
    return redirectWithQueryString(res, {
      error: "Provide code and state query param"
    });
  }

  if (!states.includes(state)) {
    return redirectWithQueryString(res, { error: "Unknown state" });
  }

  states.splice(states.indexOf(state), 1);

  try {
    const { status, data } = await getClientToken(code);
    if (status === 200) {
      const qs = querystring.parse(data);
      if (qs.error) {
        return redirectWithQueryString(res, { error: qs.error_description });
      }
      registerUser(qs.access_token, req.headers["x-forwarded-for"]);
      return redirectWithQueryString(res, { access_token: qs.access_token });
    }
    return redirectWithQueryString(res, { error: "GitHub server error." });
  } catch (err) {
    redirectWithQueryString(res, { error: "Unknown error" });
  }
};

module.exports = { loginHandler, callbackHandler };
