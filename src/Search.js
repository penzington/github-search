import React from "react";
import { Connect, query } from "urql";

const SearchQuery = `
query($name: String!) {
  search(first: 10, type: USER, query: $name) {
    userCount
    edges {
      node {
        ... on User {
          name
          id
        }
      }
    }
  }
}
`;

const SearchResult = ({ name }) => <div>{name}</div>;

const SearchContainer = class extends React.Component {
  state = {
    searchQuery: ""
  };

  onSearchType = e => {
    this.setState({ searchQuery: e.target.value });
  };

  render() {
    return (
      <div>
        <input type="search" onChange={this.onSearchType} />
        <Connect
          query={query(SearchQuery, {
            name: `fullname:${this.state.searchQuery}`
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
