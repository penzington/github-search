import React from "react";
import ReactDOM from "react-dom";
import "./assets/index.css";
import fetchIntercept from "./utils/fetch-intercept";
import { getAccessTokenFromURL } from "./utils/auth";
import App from "./App";

const accessToken = getAccessTokenFromURL();
fetchIntercept(accessToken);
ReactDOM.render(<App token={accessToken} />, document.getElementById("root"));
