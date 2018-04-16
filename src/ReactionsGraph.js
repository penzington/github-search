import React from "react";
import styled from "styled-components";
import media from "styled-media-query";
import { Connect, query } from "urql";

const Graph = styled.div`
  padding: 1rem;
  ${media.greaterThan("medium")`
    width: 50%;
  `};
`;

const GraphBars = styled.div`
  padding-top: 3rem;
  height: 300px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
`;

const GraphTitle = styled.div`
  margin: 0;
  font-size: 1.4em;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const GraphPaginationActions = styled.div`
  margin-top: 3rem;
  padding: 1rem 0;
  display: flex;
  justify-content: space-between;
`;
const GraphPaginationAction = styled.button`
  border: 0;
  background: ${props => props.theme.colors.secondaryBackground};
  font-size: inherit;
  font-family: inherit;
  color: inherit;
  padding: 0.5rem 1rem;
`;

const GraphBar = styled.div`
  width: ${props => 100 / props.barCount}%;
  height: ${props => props.value / props.maxValue * 100}%;
  min-height: 1px;
  position: relative;
  background: ${props => (props.loaded ? props.color : "transparent")};
  transition: background 250ms ease-in;
  & + * {
    margin-left: 1.5em;
  }
  &::after {
    content: "${props => props.emoji}";
    position: absolute;
    top: calc(100% + 10px); 
    right: 50%;
    font-size: 2em;
    transform: translateX(50%);
  }
  &::before {
    color: ${props => (props.loaded ? props.color : "transparent")};
    content: "${props => props.value}";
    position: absolute;
    bottom: calc(100% + 2px); 
    right: 50%;
    font-size: 1.2em;
    transform: translateX(50%);
  }
`;

const getEmojiStats = issues =>
  issues
    .reduce((reactions, issue) => {
      return [...reactions, ...issue.node.reactions.edges];
    }, [])
    .reduce((byEmoji, reaction) => {
      return {
        ...byEmoji,
        [reaction.node.content]: (byEmoji[reaction.node.content] || 0) + 1
      };
    }, {});

const reactions = {
  THUMBS_UP: ["#43A19E", "👍"],
  THUMBS_DOWN: ["#7B43A1", "👎"],
  LAUGH: ["#F2317A", "😄"],
  HOORAY: ["#FF9824", "🎉"],
  CONFUSED: ["#58CF6C", "😕"],
  HEART: ["#00c6fb", "❤️"]
};

const ReactionsGraph = class extends React.Component {
  render() {
    const emojiStats = getEmojiStats(this.props.issues);
    const chartData = Object.keys(reactions).map(reaction => ({
      name: reaction,
      emoji: reactions[reaction][1],
      color: reactions[reaction][0],
      value: emojiStats[reaction] || 0
    }));
    const maxValue = chartData.reduce(
      (value, reaction) => (reaction.value > value ? reaction.value : value),
      0
    );
    return (
      <Graph>
        <GraphTitle>
          <span>Reactions to Issues</span>{" "}
          {this.props.fetching && <small>Loading...</small>}
        </GraphTitle>
        <GraphBars>
          {chartData.map(reaction => (
            <GraphBar
              loaded={this.props.loaded}
              key={reaction.name}
              barCount={chartData.length}
              maxValue={maxValue}
              {...reaction}
            />
          ))}
        </GraphBars>
        <GraphPaginationActions>
          {this.props.hasNext && (
            <GraphPaginationAction
              disabled={this.props.fetching}
              onClick={this.props.onLoadNextPage}
            >
              Older issues
            </GraphPaginationAction>
          )}
          {this.props.hasPrevious && (
            <GraphPaginationAction
              disabled={this.props.fetching}
              onClick={this.props.onLoadPreviousPage}
            >
              Newer issues
            </GraphPaginationAction>
          )}
        </GraphPaginationActions>
      </Graph>
    );
  }
};

const PAGE_SIZE = 100;
const ReactionsQuery = `
  query($login: String!, $cursor: String) {
    user(login: $login) {
      issues(first: ${PAGE_SIZE},  after: $cursor, orderBy: { field: CREATED_AT, direction: DESC }) {
        edges {
          cursor
          node {
            id,
            reactions(first: 100) {
            totalCount
              edges {
                  node {
                    content
                  }
              }
            }
          }
        }
      }
    }
  }
`;

const ReactionsGraphSmartContainer = class extends React.Component {
  state = {
    cursors: []
  };

  loadNextPage = cursor => {
    console.log(cursor, this.state.cursors);
    this.setState({ cursors: [cursor, ...this.state.cursors] });
  };

  loadPreviousPage = () => {
    this.setState({ cursors: this.state.cursors.slice(1) });
  };

  render() {
    const { login } = this.props;

    return (
      <Connect
        query={query(ReactionsQuery, {
          login,
          cursor: this.state.cursors[0],
          queryType: "reactions"
        })}
      >
        {({ loaded, fetching, data, error }) => {
          const issues = loaded ? data.user.issues.edges : [];
          return (
            <ReactionsGraph
              issues={issues}
              loaded={loaded}
              fetching={fetching}
              hasNext={issues.length === PAGE_SIZE}
              hasPrevious={!!this.state.cursors.length}
              onLoadNextPage={this.loadNextPage.bind(
                this,
                !!issues.length ? issues[issues.length - 1].cursor : ""
              )}
              onLoadPreviousPage={this.loadPreviousPage}
            />
          );
        }}
      </Connect>
    );
  }
};
export default ReactionsGraphSmartContainer;
