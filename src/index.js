import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

const queryParams = new URLSearchParams(document.location.search);
let ghAccessToken;
if (queryParams.get("access_token")) {
  ghAccessToken = queryParams.get("access_token");
  localStorage.setItem("access_token", ghAccessToken);
  window.history.pushState(null, "", document.location.href.split("?")[0]);
} else {
  ghAccessToken = localStorage.getItem("access_token");
}

ReactDOM.render(<App token={ghAccessToken} />, document.getElementById("root"));
