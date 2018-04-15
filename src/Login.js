import React from "react";
import styled from "styled-components";
import Button from "./components/Button";
import Logo from "./components/Logo";

const Page = styled.div`
  background-image: linear-gradient(to top, #00c6fb 0%, #005bea 100%);
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ButtonLink = Button.withComponent("a");

const SpacedLogo = styled(Logo)`
  margin-bottom: 1em;
  font-size: 3em;
`;

const Login = () => (
  <Page>
    <SpacedLogo>Who Can Do My Code Review?!</SpacedLogo>
    <ButtonLink href="https://micro-github-hldmzekljp.now.sh/login">
      Login with GitHub
    </ButtonLink>
  </Page>
);

export default Login;
