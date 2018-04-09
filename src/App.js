import React from "react";
import { Provider, Client } from "urql";
import Home from "./Home";
import Search from "./Search";

const getClient = token =>
  new Client({
    url: "https://api.github.com/graphql",
    fetchOptions: {
      headers: {
        Authorization: `bearer ${token}`
      }
    }
  });

export const App = ({ token }) => (
  <Provider client={getClient(token)}>
    <Home />
    <Search />
  </Provider>
);

export default App;
