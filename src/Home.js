import React from "react";
import { Connect, query } from "urql";

const ViewerQuery = `
{
  viewer {
    avatarUrl
    bio
    company
    createdAt
    location
    login
    name
    url
    websiteUrl
  }
}
`;

const Home = ({ name, login, location, url, company, bio, avatarUrl }) => (
  <div>
    <h1>
      {name}{" "}
      <a href={url}>
        <code>{login}</code>
      </a>
    </h1>
    <img alt={name} src={avatarUrl} />
    <p>{bio}</p>
    <p>
      Works at {company}. Lives in {location}.
    </p>
  </div>
);

const HomeContainer = () => (
  <Connect query={query(ViewerQuery)}>
    {({ loaded, data }) => {
      return loaded ? <Home {...data.viewer} /> : "loading...";
    }}
  </Connect>
);

export default HomeContainer;
