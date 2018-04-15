import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Page = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 2em;
`;

const StyledLink = styled(Link)``;

const Login = () => (
  <Page>
    <p>
      Nothing to see here{" "}
      <span role="img" aria-label="Sorry!">
        😭
      </span>
    </p>
    <StyledLink to="/">Go to Search Page</StyledLink>
  </Page>
);

export default Login;
