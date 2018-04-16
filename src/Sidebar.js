import React from "react";
import styled, { css } from "styled-components";
import media from "styled-media-query";
import { Link, withRouter } from "react-router-dom";
import Button from "./components/Button";
import Logo from "./components/Logo";
import { GitHubLogo } from "./components/Icons";
import { Connect, query } from "urql";
import placeholderAvatarUrl from "./avatar.png";
import { logout } from "./auth";

const Avatar = styled.img`
  width: 8em;
  height: 8em;
  border-radius: 100%;
  transition: opacity 250ms ease-out;
  transition-delay: 200ms;
  opacity: ${props => (props.loaded ? 1 : 0.3)};
  ${media.lessThan("small")`
    margin-right: 1em;
  `};
`;

const Container = styled.div`
  background-image: linear-gradient(
    to top,
    ${props => props.theme.colors.lightBlue} 0%,
    ${props => props.theme.colors.darkBlue} 100%
  );
  padding: 1em;
  padding-top: 3em;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const CurrentUser = styled.div`
  text-align: center;
  padding: 2em 1em;
  color: ${props => props.theme.colors.secondaryBackground};
  ${media.lessThan("small")`
    display: flex;
    justify-content: center;
    align-items: center;
  `};
`;

const UserName = styled.div`
  font-size: 1.3em;
  margin-top: 1em;
  margin-bottom: 2em;
  a {
    text-decoration: none;
    color: inherit;
  }
`;

const LoadableText = styled.span`
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
const LogoLink = styled(Link)`
  text-decoration: none;
`;

const Sidebar = ({
  user: { name, login, location, url, company, bio, avatarUrl },
  loaded,
  onLogout
}) => (
  <Container>
    <LogoLink to="/">
      <Logo />
    </LogoLink>
    <CurrentUser>
      <Avatar alt={name} src={avatarUrl} loaded={loaded} />
      <UserName>
        <a href={url || "#"}>
          {!!name && (
            <div>
              <LoadableText loaded={loaded}>{name}</LoadableText>
            </div>
          )}
          <LoadableCode loaded={loaded}>
            <GitHubLogo width="16" height="16" />/{login}
          </LoadableCode>
        </a>
      </UserName>
    </CurrentUser>
    <Button onClick={onLogout}>Logout</Button>
  </Container>
);

const ViewerQuery = `
  {
    viewer {
      avatarUrl
      login
      name
      url
    }
  }
`;

const placeholderOfLength = length => "\u00A0".repeat(length);
const loadingUser = {
  avatarUrl: placeholderAvatarUrl,
  login: placeholderOfLength(10),
  name: placeholderOfLength(20),
  url: "#"
};

const SidebarContainer = class extends React.Component {
  logout = () => {
    logout();
    this.props.history.push("/login");
  };

  render() {
    return (
      <Connect query={query(ViewerQuery, { queryType: "viewer" })}>
        {({ loaded, data }) => (
          <Sidebar
            user={loaded ? data.viewer : loadingUser}
            loaded={loaded}
            onLogout={this.logout}
          />
        )}
      </Connect>
    );
  }
};

export default withRouter(SidebarContainer);
