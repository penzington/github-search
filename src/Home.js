import React from "react";
import media from "styled-media-query";
import { Route, Switch, Redirect } from "react-router-dom";
import styled from "styled-components";
import ScrollToTop from "./components/ScrollToTop";
import Sidebar from "./Sidebar";
import Search from "./Search";
import Profile from "./Profile";
import Page404 from "./404";

const Layout = styled.div`
  font-size: 0.9em;
  display: grid;
  height: 100vh;
  display: grid;
  grid-template-rows: 1fr auto;
  grid-template-columns: 1fr 4fr;
  grid-template-areas:
    "🍫 🔎"
    "🍫 👞";

  @media (min-height: 900px) {
    font-size: 1em;
  }

  ${media.lessThan("medium")`
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

const SearchResults = styled(LayoutElement)``;

const Home = () => (
  <Layout>
    <LayoutElement slot="🍫">
      <Sidebar />
    </LayoutElement>
    <SearchResults slot="🔎">
      <Switch>
        <Route path={`/profiles/:login`} component={Profile} />
        <Redirect exact from="/" to="/search" />
        <Route path={`/search/:searchQuery?`} component={Search} />
        <Route component={Page404} />
      </Switch>
      <ScrollToTop />
    </SearchResults>
    <Footer slot="👞">
      <a href="http://peka.la">2018 Maciej Pękala</a>
    </Footer>
  </Layout>
);

export default Home;
