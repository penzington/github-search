import React from "react";
import { Provider, Client } from "urql";
import { ThemeProvider } from "styled-components";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import theme from "./theme";
import Home from "./Home";
import Login from "./Login";

const getClient = token =>
  new Client({
    url: "https://api.github.com/graphql",
    fetchOptions: {
      headers: {
        Authorization: `bearer ${token}`
      }
    }
  });

const ProtectedRoute = ({ component: Component, isLoggedIn, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isLoggedIn ? <Component {...props} /> : <Redirect to="/login" />
    }
  />
);

export const App = ({ token }) => (
  <Provider client={getClient(token)}>
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route path="/login" component={Login} />
          <ProtectedRoute path="/" isLoggedIn={!!token} component={Home} />
          <Redirect to="/login" />
        </Switch>
      </Router>
    </ThemeProvider>
  </Provider>
);

export default App;
