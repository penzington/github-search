import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import fetchIntercept from "./fetch-intercept";
import { getAccessTokenFromURL } from "./auth";

const accessToken = getAccessTokenFromURL();
fetchIntercept(accessToken);
ReactDOM.render(<App token={accessToken} />, document.getElementById("root"));
