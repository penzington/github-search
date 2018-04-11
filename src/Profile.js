import React from "react";
import { Connect, query } from "urql";

const ProfileQuery = `
query($login: String!) {
  user(login: $login) {
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

const Profile = ({ name, login, location, url, company, bio, avatarUrl }) => (
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

const ProfileContainer = ({ match }) => (
  <Connect query={query(ProfileQuery, { login: match.params.login })}>
    {({ loaded, data }) => {
      return loaded ? <Profile {...data.user} /> : "loading...";
    }}
  </Connect>
);

export default ProfileContainer;
