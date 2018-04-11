import React from "react";
import { Connect, query } from "urql";
import { Link } from "react-router-dom";
import throttle from "lodash.throttle";

const SearchQuery = `
query($name: String!) {
  search(first: 10, type: USER, query: $name) {
    userCount
    edges {
      node {
        ... on User {
          name
          login
          id
        }
      }
    }
  }
}
`;

const SearchResult = ({ name, login }) => (
  <Link to={`profiles/${login}`}>{name}</Link>
);

const SearchContainer = class extends React.Component {
  constructor() {
    super();
    this.updateSearchQuery = throttle(this.updateSearchQuery, 500);
  }

  state = {
    searchQuery: ""
  };

  updateSearchQuery = searchQuery => this.setState({ searchQuery });

  render() {
    return (
      <div>
        <input
          type="search"
          onChange={e => this.updateSearchQuery(e.target.value)}
        />
        <Connect
          query={query(SearchQuery, {
            name: this.state.searchQuery
          })}
        >
          {({ loaded, data, error }) => {
            if (error) {
              return JSON.stringify(error);
            }
            return loaded
              ? data.search.edges.map(({ node }) => (
                  <SearchResult key={node.id} {...node} />
                ))
              : "loading...";
          }}
        </Connect>
      </div>
    );
  }
};

export default SearchContainer;
