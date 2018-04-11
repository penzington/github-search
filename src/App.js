import React from "react";
import { Provider, Client } from "urql";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Profile from "./Profile";

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
    <Router>
      <Switch>
        <ProtectedRoute exact path="/" isLoggedIn={!!token} component={Home} />
        <ProtectedRoute
          path={`/profiles/:login`}
          isLoggedIn={!!token}
          component={Profile}
        />
        <Route path="/login" component={Login} />
        <Route component={() => "404 :("} />
      </Switch>
    </Router>
  </Provider>
);

export default App;
