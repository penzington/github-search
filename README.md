# Who Can Do My Code Review?!
> A Single-page application (SPA) that displays and visualizes data for any given Github user

**See it live! [whocandomycode.review](https://whocandomycode.review)**

## Content
<!-- toc -->

- [Architecture](#architecture)
  * [Auth flow](#auth-flow)
  * [GitHub API usage](#github-api-usage)
  * [Usage stats](#usage-stats)
    + [Notes](#notes)
- [App requirements](#app-requirements)
- [Backend - frontend communication](#backend---frontend-communication)
- [Development](#development)
  * [Running the app](#running-the-app)
    + [Prepare](#prepare)
    + [Quick start](#quick-start)
    + [Less quick start](#less-quick-start)
    + [I don't want to install node!](#i-dont-want-to-install-node)
  * [Technologies](#technologies)
    + [Frontend](#frontend)
    + [Backend](#backend)
  * [Project structure](#project-structure)
    + [Frontend](#frontend-1)
  * [Backend](#backend-1)
  * [Tests](#tests)
- [Deployment](#deployment)
  * [Backend](#backend-2)
  * [Frontend](#frontend-2)
- [Technology considerations](#technology-considerations)
  * [Proxying GitHub requests through the backend.](#proxying-github-requests-through-the-backend)
  * [Using types (e.g. flowtype)](#using-types-eg-flowtype)
  * [GitHub GraphQL API vs Rest API](#github-graphql-api-vs-rest-api)
  * [Auth using OAuth](#auth-using-oauth)
  * [Styling with Styled Components](#styling-with-styled-components)

<!-- tocstop -->

# Architecture
The app consists of a fully static SPA frontend and a backend service used for oAuth authentication with GitHub as well as logging and serving of usage stats.

## Auth flow
The authentication flow follows the GitHub's [web application flow](https://developer.github.com/apps/building-oauth-apps/authorization-options-for-oauth-apps/#web-application-flow). 

In practice, you will first need to [create a GitHub app](https://developer.github.com/apps/building-github-apps/creating-a-github-app/), to get secret and public app keys. The backend service of this app needs these two keys (they are inject as configuration through env variables). 

*Note: You will most likely need to create two GitHub apps - one for development and one for production, to get two sets of keys and to configure the redirect URL to localhost and your remote domain.*

The backend service exposes two endpoints - `/login` and `/callback`. To request login, the client hits the `/login` endpoint, which generates a unique `state` string which is saved in the memory, and redirects the user to GitHub's authentication page. When the user confirms, GitHub redirects the user back to our backend service, to the `/callback` endpoint (this is configured in the GitHub app's settings). Then the user is redirected back to the app, with a GitHub API access token provided. The app can then use that token to access the API.

## GitHub API usage
The app contacts the GitHub API through the [GraphQL endpoint](https://developer.github.com/v4) directly. Several queries are used, e.g. for current user, search or specific user.

## Usage stats
The app reports all calls to the GitHub API back the the server using the [Beacon API](https://developer.mozilla.org/en-US/docs/Web/API/Beacon_API). The type of GraphQL query, query variables, time and duration of the request are saved. 

### Notes
This is the feature that is the most unfinished. It's mostly a sketch of what the solution could be. Some remarks here:
- At the moment the stats are publicly available. You can use the `log/users` route (e.g. https://whocandomycode.review/api/log/users) to get the list of the users and aggregate query number and `log/users/${login}` to get the list of logs for queries done by the user.
- The endpoints are very naive (e.g. no pagination);
- With the current implementation, the logs are stored in memory, which causes obvious problems, e.g. they get wiped on every deployment and when now decides to restart the server container and if they run log enough they will eventually run out of memory.
- There is no UI to view the stats.

# App requirements
The SPA requires a modern browser supporting, among others, `fetch`, `URLSearchParams` and Beacon API. In practice, it should work on all ever-green browsers in their latests versions (including Safari in the newest version 11.1). If in doubt, use the latest Chrome.

*Note: Only tested in Chrome, Firefox, Safari and Chrome on Android.*

# Backend - frontend communication
To avoid any CORS issues, the API calls from frontend to the backend (e.g. the login or the logs requests) are proxied throught the same domain as the frontend. The proxy is set up on the `/api` route. 

In development, `create-react-app` takes care of the proxying (see `proxy` key in `package.json` in root directory). When ran through `docker-compose` the proxy points to the backend container name (since both containers are in the same docker network).

In production, a proxy needs to be set up. See [deployment](#deployment) for an example.

# Development

## Running the app

### Prepare
You'll need the GitHub codes for the development version of the app (as described above). You need to place them in an `.env` file in the `backend` directory.
### Quick start

A quickest way to get started is using Make:

```sh
make
```

*Note: This command requires that you have Make, node >v9, and yarn installed locally.*

This starts frontend and backend of the app in development mode locally, and opens the browser with the local version of the app running.

*Note: You will need to accept the self-signed HTTPS certificate.*

### Less quick start

You can also start the local development setup more manually:
- install dependencies in the root and `backend` directories (`yarn` / `npm install`).
- start the node backend (`yarn dev` / `npm run dev`) in `backend` directory
- start the SPA development server (`yarn start` / `npm start`) in the root directory

### I don't want to install node!

Alternatively, you can also start the whole shebang in Docker. To do that, simply run `make run-docker-fullstack` or `docker-compose up`. Everything should work (including auto-reloading of changes), but some things will be annoying (e.g. you can add dependencies without rebuilding docker images).

## Technologies
### Frontend
The app is a SPA app, developed using [React](https://reactjs.org) as the view library. Other significant dependencies are:

  - [urql](https://github.com/FormidableLabs/urql): a GraphQL client, exposed as a set of ReactJS components.
  - [React Router](https://reacttraining.com/react-router) - declarative routing solution, exposed as a set of ReactJS components.
  - [Styled Components](https://www.styled-components.com/) - CSS-in-JS solution for authoring CSS in a maintainable fashion.

The frontend app development environment is [`create-react-app`](https://github.com/facebook/create-react-app). Refer to their [user guide](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md) for details on the setup.

The only two adjustments to the standard `create-react-app` setup are:
 - added [Prettier](https://prettier.io/) for auto-formatting of code on save (setup to work through ESLint auto-fix text editor integrations).
 - added a git hook for linting+testing on commits (using [lint-stages](https://github.com/okonet/lint-staged) + [husky](https://github.com/typicode/husky)).

### Backend

The backend component is a small [Express](https://expressjs.com) application, with a standard setup (e.g. body parser, and request logging with [morgan](https://github.com/expressjs/morgan)).

Other significant dependencies are:

  - [axios](https://github.com/axios/axios) - a promise based HTTP client
  - [nedb](https://github.com/louischatriot/nedb) - a in-memory pure-JS NoSQL database

The backend server in development is live-reloaded using [nodemon](https://github.com/remy/nodemon).

## Project structure

### Frontend
Source code for the the frontend of the app lives in `src` directory. `index.js` is the entrypoint to the app. Each component that requires data from the GitHub declares its own data dependencies.

## Backend
Source code for the the frontend of the app lives in `backend/src` directory. `index.js` is the entrypoint to the app. Handlers for routes are split between handler files, and `user-register.js` bootstraps the stats database and exposes methods for saving and retrieving stats data.

## Tests

Project is not heavily tested yet, but there are some unit tests for the most fragile logic in the frontend. They are run using [Jest](https://facebook.github.io/jest/) testing framework, which comes bundled with CRA. You can run the tests with `make test`, they are also ran on every commit.

# Deployment
The frontend and backend components are deployed separately, as their needs for hosting are very different.

## Backend 
Backend is deployed using [`now.sh`](https://zeit.co/now). It's a great service for node apps, with an easy support for Docker deployments. 
Deployment configuration is defined in the `backend/package.json` file under the `now` key. It also requires a `.env.production` file with GitHub app keys and URL to the redirect URL.
## Frontend
Frontend is deployed using [Netlify](netlify.com). It's a great service for deploying static apps and websites. Netlify has an integrated CD solution, which works great with a `create-react-app`-based apps. The only bit of configuration needed is the `public/_redirects` file, where the URL of the backend service in production needs to specified.

# Technology considerations

## Proxying GitHub requests through the backend.
I considered proxying all GitHub calls through the backend service, to make it easier the requirement of gathering usage statistics. However, hitting GitHub directly means lower latency on the calls and the app can in principle still work, even if the backend doesn't (at least for logged in users).

## Using types (e.g. flowtype)
Usually I'd add types using `flowtype`, but due to limited time for this project and somewhat loose requirements for "correctness" I decided not to.

## GitHub GraphQL API vs Rest API
I decided to use GraphQL API mostly because I haven't used it for a proper project like this before and wanted to learn it. It also fits with React's declarative nature perfectly. I later realized that GitHub does not have a feature parity of their GraphQL API with the Rest API, which might had changed my mind, had I known in advance.

## Auth using OAuth
I have decided to go with recommended OAuth flow for logging in, even tough other alternatives exist (i.e. username/password or user-provided access keys). I decided that the UX of the OAuth is very much better and the complexity required is acceptable.

## Styling with Styled Components
A myriad of styling solutions exists, but I tend to opt for `styled-components` these days. It combined the familiarity of CSS with the power of CSS-in-JS. The performance penalty exists, but it's acceptable (especially with the latest versions of the library).