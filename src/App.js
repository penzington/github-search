import React from "react";
import { Provider, Client, Connect, query } from "urql";

const getClient = token =>
  new Client({
    url: "https://api.github.com/graphql",
    fetchOptions: {
      headers: {
        Authorization: `bearer ${token}`
      }
    }
  });

const TodoQuery = `
  query { viewer { login } }
`;

const Home = () => (
  <Connect query={query(TodoQuery)}>
    {({ loaded, fetching, refetch, data, error, addTodo }) => {
      return loaded ? <div>${JSON.stringify(data)}</div> : "loading...";
    }}
  </Connect>
);
export const App = ({ token }) => (
  <Provider client={getClient(token)}>
    <Home />
  </Provider>
);

export default App;
