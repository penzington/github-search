const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();
const asyncWrapper = require("./async-wrapper");
const { loginHandler, callbackHandler } = require("./login-handler");
const errorHandler = require("./error-handler");
const logoutHandler = require("./logout-handler");
const {
  logPostHandler,
  logUsersGetHandler,
  logUserGetHandler
} = require("./log-handler");
const PORT = process.env.PORT || 3001;

app.use(morgan("tiny"));
app.use(bodyParser.text());

app.get("/login", asyncWrapper(loginHandler));
app.get("/logout/:id", logoutHandler);
app.get("/callback", asyncWrapper(callbackHandler));
app.post("/log", logPostHandler);
app.get("/log/users", asyncWrapper(logUsersGetHandler));
app.get("/log/users/:id", asyncWrapper(logUserGetHandler));

app.use(errorHandler);

app.listen(PORT, () => console.log(`We're golden on port ${PORT}!`));
