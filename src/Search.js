import React from "react";
import styled from "styled-components";
import { Connect, query } from "urql";
import { Link, withRouter } from "react-router-dom";
import throttle from "lodash.throttle";
import SearchResult, { SearchResultInput } from "./SearchResult";
import Button from "./components/Button";

const SearchContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const IntroMessage = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.mutedTextColor};
  padding: 1em;
`;

const SearchResultLink = styled(Link)`
  text-decoration: none;
  display: block;
`;

const SearchInput = styled(SearchResult)`
  padding: 3em 1em 0;
  background: ${props => props.theme.colors.secondaryBackground};
`;

const ClearSearchQueryButton = styled.button`
  background: none;
  border: 0;
  font-size: inherit;
  font-family: inherit;
  padding: 1em;
  margin: -1em;
`;

const SearchResultsMeta = styled.div`
  padding: 1em;
  text-align: right;
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse;
  background: ${props => props.theme.colors.secondaryBackground};
`;

const PaginationActions = styled.div`
  text-align: center;
  padding: 1em;
  > * + * {
    margin-left: 1em;
  }
`;

const SearchResultsContainer = styled.div`
  overflow-y: scroll;
  overflow-x: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const SearchResults = styled.div`
  flex: 1;
`;

const paginationButtonTheme = {
  colors: {
    buttonBg: "#eee",
    buttonBgHover: "transparent",
    buttonColorHover: "#999",
    buttonColor: "#999"
  }
};

export const Search = class extends React.Component {
  componentDidMount() {
    if (!this.props.searchQuery) {
      this.input.focus();
    } else {
      this.input.innerText = this.props.searchQuery;
      const range = document.createRange();
      range.selectNodeContents(this.input);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  updateInputValue = event => {
    this.props.onTypeSearch(event.target.innerText);
  };

  handleSubmit = event => {
    var key = event.which || event.keyCode;
    if (key === 13) {
      event.preventDefault();
      const result = this.props.results[0];
      if (result) {
        this.props.onSearchSubmit(result);
      }
    }
  };

  onClearSearchTerm = () => {
    this.props.onClearSearchTerm();
    this.input.innerText = "";
    this.input.focus();
  };

  getSearchStatus() {
    if (!this.props.loaded) {
      return "Loading...";
    }
    if (this.props.fetching) {
      return "Searching...";
    }
    if (this.props.count === 0) {
      return "No user found.";
    }
    if (this.props.count === 1) {
      return "Only one user found.";
    }
    if (!this.props.searchQuery) {
      return `${this.props.count} users on GitHub.`;
    }
    return `${this.props.count} users found.`;
  }

  render() {
    return (
      <SearchContainer>
        <SearchInput
          inputValue={this.props.searchQuery}
          result={
            this.props.searchQuery && this.props.results[0]
              ? this.props.results[0].node
              : null
          }
          onClick={() => this.input.focus()}
        >
          <SearchResultInput
            innerRef={node => (this.input = node)}
            contentEditable
            onKeyPress={this.handleSubmit}
            onInput={this.updateInputValue}
          />
        </SearchInput>
        <SearchResultsMeta>
          <span>{this.getSearchStatus()}</span>
          {this.props.searchQuery && (
            <ClearSearchQueryButton onClick={this.onClearSearchTerm}>
              Clear search term
            </ClearSearchQueryButton>
          )}
        </SearchResultsMeta>
        {!this.props.searchQuery && (
          <IntroMessage>
            Not ready to type yet? Check out these solid GitHubbers!
          </IntroMessage>
        )}
        <SearchResultsContainer>
          <SearchResults>
            {this.props.results.map(result => result.node).map(result => (
              <SearchResultLink
                to={`/profiles/${result.login}`}
                key={result.id}
              >
                <SearchResult
                  inputValue={this.props.searchQuery}
                  result={result}
                  showDetails
                  small
                >
                  <SearchResultInput>
                    {this.props.searchQuery || "\u200b"}
                  </SearchResultInput>
                </SearchResult>
              </SearchResultLink>
            ))}
          </SearchResults>
          <PaginationActions>
            {this.props.hasPrevious && (
              <Button
                theme={paginationButtonTheme}
                onClick={this.props.onLoadPreviousPage}
              >
                Wait, revert!
              </Button>
            )}
            {this.props.hasNext && (
              <Button
                theme={paginationButtonTheme}
                onClick={this.props.onLoadNextPage}
              >
                Give me more!
              </Button>
            )}
          </PaginationActions>
        </SearchResultsContainer>
      </SearchContainer>
    );
  }
};

const PAGE_SIZE = 5;
const SearchQuery = `
  query($queryValue: String!, $cursor: String) {
    search(first: ${PAGE_SIZE}, type: USER, query: $queryValue, after: $cursor) {
      userCount
      edges {
        cursor
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

const SearchSmartContainer = class extends React.Component {
  constructor(props) {
    super(props);
    this.updateSearchQuery = throttle(this.updateSearchQuery, 200);
  }

  state = {
    searchQuery: this.props.match.params.searchQuery || "",
    cursors: []
  };

  updateSearchQuery = searchQuery => {
    this.setState({ searchQuery, cursors: [] });
    this.props.history.replace(`/search/${searchQuery}`);
  };

  searchSubmit = result => {
    this.props.history.push(`/profiles/${result.node.login}`);
  };

  getQueryValue = () => {
    return `${this.state.searchQuery
      .trim()
      .replace(/\./g, "")} in:name in:login in:fullname type:user`;
  };

  loadNextPage = cursor => {
    this.setState({ cursors: [cursor, ...this.state.cursors] });
  };
  loadPreviousPage = () => {
    this.setState({ cursors: this.state.cursors.slice(1) });
  };
  clearSearchQuery = () => {
    this.setState({ searchQuery: "" });
    this.props.history.replace(`/search`);
  };

  render() {
    return (
      <Connect
        query={query(SearchQuery, {
          queryValue: this.getQueryValue(),
          cursor: this.state.cursors[0],
          queryType: "search"
        })}
      >
        {({ loaded, fetching, data, error }) => (
          <Search
            results={loaded ? data.search.edges : []}
            onTypeSearch={this.updateSearchQuery}
            count={loaded ? data.search.userCount : 0}
            loaded={loaded}
            fetching={fetching}
            searchQuery={this.state.searchQuery}
            hasNext={loaded ? data.search.edges.length === PAGE_SIZE : false}
            hasPrevious={!!this.state.cursors.length}
            onLoadNextPage={this.loadNextPage.bind(
              this,
              loaded && !!data.search.edges.length
                ? data.search.edges[data.search.edges.length - 1].cursor
                : ""
            )}
            onLoadPreviousPage={this.loadPreviousPage}
            onClearSearchTerm={this.clearSearchQuery}
            onSearchSubmit={this.searchSubmit}
          />
        )}
      </Connect>
    );
  }
};

export default withRouter(SearchSmartContainer);
