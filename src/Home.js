import React from "react";
import { Connect, query } from "urql";

const TodoQuery = `
{
  viewer {
    login
    avatarUrl
    bio
    company
    createdAt
    location
    url
    websiteUrl
  }
}
`;

const Home = () => (
  <Connect query={query(TodoQuery)}>
    {({ loaded, fetching, refetch, data, error, addTodo }) => {
      return loaded ? <div>${JSON.stringify(data)}</div> : "loading...";
    }}
  </Connect>
);

export default Home;
