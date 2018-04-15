import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import styled from "styled-components";
import Sidebar from "./Sidebar";
import Search from "./Search";
import Profile from "./Profile";
import Page404 from "./404";
import { media } from "./theme";

const Layout = styled.div`
  font-size: 0.9em;
  display: grid;
  height: 100vh;
  display: grid;
  grid-template-rows: 1fr auto;
  grid-template-columns: 1fr 4fr;
  grid-template-areas:
    "😀 🔎"
    "😀 👞";
  ${media.tall`
    font-size: 1em;
  `};
  ${media.smallOnly`
    display: block;
    font-size: 0.8em;
  `};
`;

const LayoutElement = styled.div`
  grid-area: ${props => props.slot};
`;

const Footer = styled(LayoutElement.withComponent("footer"))`
  padding: 20px;
  text-align: center;
  a {
    font-weight: bold;
    color: #ccc;
    text-transform: uppercase;
    letter-spacing: 1px;
    text-decoration: none;
  }
`;

const SearchResults = styled(LayoutElement)`
  overflow: hidden;
`;

const Home = () => (
  <Layout>
    <LayoutElement slot="😀">
      <Sidebar />
    </LayoutElement>
    <SearchResults slot="🔎">
      <Switch>
        <Route path={`/profiles/:login`} component={Profile} />
        <Redirect exact from="/" to="/search" />
        <Route path={`/search/:searchQuery?`} component={Search} />
        <Route component={Page404} />
      </Switch>
    </SearchResults>
    <Footer slot="👞">
      <a href="http://peka.la">2018 Maciej Pękala</a>
    </Footer>
  </Layout>
);

export default Home;
