import React from "react";
import { withRouter, Redirect } from "react-router-dom";
import media from "styled-media-query";
import { Connect, query } from "urql";
import { format } from "date-fns";
import styled, { css } from "styled-components";
import placeholderAvatarUrl from "./avatar.png";
import { GitHubLogo, Back } from "./components/Icons";
import ReactionsGraph from "./ReactionsGraph";

function normalizeUrl(url) {
  if (!/^(?:f|ht)tps?:\/\//.test(url)) {
    url = "http://" + url;
  }
  return url;
}

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
`;
const ProfileDetails = styled.div`
  background: ${props => props.theme.colors.secondaryBackground};
  padding: 2em;
  padding-top: 0;
  ${media.greaterThan("medium")`
    display: flex;
  `};
`;
const ProfileDetailsAvatar = styled.div`
  margin-right: 2em;
`;
const ProfileDetailsInfo = styled.div``;
const Avatar = styled.img`
  width: 15em;
  height: 15em;
  transition: opacity 250ms ease-out;
  transition-delay: 200ms;
  opacity: ${props => (props.loaded ? 1 : 0.3)};
`;

const UserName = styled.div`
  font-size: 2em;
  a {
    text-decoration: none;
    color: inherit;
  }
`;

const UserBio = styled.div`
  margin-top: 1em;
`;

const UserInfo = styled.div`
  margin-top: 1em;
`;

const GraphsContainer = styled.div`
  margin-top: 1em;
  flex: 1;
`;

const BackLinkContainer = styled.div`
  background: ${props => props.theme.colors.secondaryBackground};
`;

const BackLink = styled.button`
  background: none;
  color: ${props => props.theme.colors.mutedTextColor};
  border: 0;
  display: flex;
  align-items: center;
  font-size: inherit;
  font-family: inherit;
  padding: 1em 2em;
  text-align: left;
  cursor: pointer;
  > * {
    margin-right: 0.5em;
  }
`;

const LoadableText = styled.span`
  display: inline-block;
  line-height: 1.4;
  ${props =>
    !props.loaded
      ? css`
          color: transparent;
          background: #00000021;
        `
      : ""};
`;
const LoadableCode = LoadableText.withComponent("code");
const LoadableLink = LoadableText.withComponent("a");

const Profile = ({
  user: { name, location, url, company, bio, avatarUrl, createdAt, websiteUrl },
  login,
  loaded,
  onBackToSearch
}) => (
  <ProfileContainer>
    <BackLinkContainer>
      <BackLink onClick={onBackToSearch}>
        <Back width="20" height="20" /> Back to search
      </BackLink>
    </BackLinkContainer>
    <ProfileDetails>
      <ProfileDetailsAvatar>
        <Avatar alt={name} src={avatarUrl} loaded={loaded} />
      </ProfileDetailsAvatar>
      <ProfileDetailsInfo>
        <UserName>
          <a href={url || "#"}>
            {!!name && (
              <div>
                <LoadableText loaded={loaded}>{name}</LoadableText>
              </div>
            )}
            <LoadableCode loaded={loaded}>
              <GitHubLogo width="1em" height="1em" />/{login}
            </LoadableCode>
          </a>
        </UserName>
        <UserBio>
          <LoadableText loaded={loaded}>{bio}</LoadableText>
        </UserBio>
        <UserInfo>
          {company && (
            <LoadableText loaded={loaded}>Works at {company}</LoadableText>
          )}
          <br />
          {location && (
            <LoadableText loaded={loaded}>Lives in {location}</LoadableText>
          )}
          <br />
          {createdAt && (
            <LoadableText loaded={loaded}>
              Member since {format(createdAt, "MMMM YYYY")}
            </LoadableText>
          )}
          <br />
          {websiteUrl &&
            websiteUrl.trim() && (
              <LoadableLink
                target="_blank"
                rel="noopener noreferrer"
                href={normalizeUrl(websiteUrl)}
                loaded={loaded}
              >
                {websiteUrl}
              </LoadableLink>
            )}
        </UserInfo>
      </ProfileDetailsInfo>
    </ProfileDetails>
    <GraphsContainer>
      <ReactionsGraph login={login} />
    </GraphsContainer>
  </ProfileContainer>
);

const ProfileQuery = `
  query($login: String!) {
    user(login: $login) {
      avatarUrl
      bio
      company
      createdAt
      location
      name
      url
      websiteUrl
    }
  }
`;

const placeholderOfLength = length => "\u00A0".repeat(length);
const loadingUser = {
  avatarUrl: placeholderAvatarUrl,
  bio: placeholderOfLength(100),
  company: placeholderOfLength(15),
  location: placeholderOfLength(15),
  login: placeholderOfLength(10),
  name: placeholderOfLength(20),
  websiteUrl: "http://localhost",
  createdAt: Date.now(),
  url: "#"
};

const ProfileSmartContainer = class extends React.Component {
  onBackToSearch = () => {
    if (this.props.history.length > 0) {
      this.props.history.goBack();
    } else {
      this.props.history.push(`/search`);
    }
  };
  render() {
    const login = this.props.match.params.login;
    return (
      <Connect query={query(ProfileQuery, { login })}>
        {({ loaded, data, error }) =>
          error || (loaded && !data.user) ? (
            <Redirect to="/404" />
          ) : (
            <Profile
              user={loaded ? data.user : loadingUser}
              login={login}
              loaded={loaded}
              onBackToSearch={this.onBackToSearch}
            />
          )
        }
      </Connect>
    );
  }
};

export default withRouter(ProfileSmartContainer);
