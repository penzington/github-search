import React, { Fragment } from "react";
import styled from "styled-components";
import { Connect, query } from "urql";
import { Link, Route } from "react-router-dom";
import throttle from "lodash.throttle";
import SearchResult, { SearchResultInput } from "./SearchResult";

const SearchQuery = `
query($queryValue: String!) {
  search(first: 10, type: USER, query: $queryValue) {
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

const SearchResultLink = styled(Link)`
  text-decoration: none;
`;

export const Search = class extends React.Component {
  state = { inputValue: "" };

  componentDidMount() {
    this.input.focus();
  }
  updateInputValue = event => {
    const inputValue = event.target.innerText;
    this.setState({ inputValue });
    this.props.onTypeSearch(inputValue);
  };
  handleSubmit = history => event => {
    var key = event.which || event.keyCode;
    if (key === 13) {
      event.preventDefault();
      const result = this.props.results[0];
      if (result) {
        history.push(`profiles/${this.props.results[0].login}`);
      }
    }
  };

  render() {
    return (
      <Fragment>
        <SearchResult
          inputValue={this.state.inputValue}
          result={this.props.results[0]}
          onClick={() => this.input.focus()}
        >
          <Route
            render={({ history }) => (
              <SearchResultInput
                innerRef={node => (this.input = node)}
                contentEditable
                onKeyPress={this.handleSubmit(history)}
                onInput={this.updateInputValue}
              />
            )}
          />
        </SearchResult>
        {this.props.results.slice(1).map(result => (
          <SearchResultLink to={`profiles/${result.login}`} key={result.id}>
            <SearchResult
              inputValue={this.state.inputValue}
              result={result}
              small
            >
              <SearchResultInput>{this.state.inputValue}</SearchResultInput>
            </SearchResult>
          </SearchResultLink>
        ))}
      </Fragment>
    );
  }
};

const SearchContainer = class extends React.Component {
  constructor() {
    super();
    this.updateSearchQuery = throttle(this.updateSearchQuery, 100);
  }

  state = {
    searchQuery: ""
  };

  updateSearchQuery = searchQuery => this.setState({ searchQuery });

  render() {
    return (
      <div>
        <Connect
          query={query(SearchQuery, {
            queryValue: `${this.state.searchQuery
              .trim()
              .replace(/\./g, "")} in:name in:login in:fullname`
          })}
        >
          {({ loaded, data, error }) => {
            if (error) {
              return JSON.stringify(error);
            }
            return loaded ? (
              <Search
                results={data.search.edges.map(({ node }) => node)}
                onTypeSearch={this.updateSearchQuery}
              />
            ) : (
              "loading..."
            );
          }}
        </Connect>
      </div>
    );
  }
};

export default SearchContainer;
