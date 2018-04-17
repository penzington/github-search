import React from "react";
import styled from "styled-components";
import { Connect, query } from "urql";
import Button from "./components/Button";

const Graph = styled.div`
  padding: 1rem;
  flex: 1;
`;

const GraphBars = styled.div`
  padding-top: 3rem;
  margin-bottom: 4rem;
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

const GraphExplanation = styled.div`
  color: ${props => props.theme.colors.mutedTextColor};
  min-height: 2em;
`;

const GraphPaginationActions = styled.div`
  margin-top: 0.5rem;
  padding: 1rem 0;
  display: flex;
  justify-content: space-between;
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

  &:hover > * {
    opacity: 1;
  }
`;

const GraphBarFloatingLabel = styled.div`
  font-size: 0.8em;
  position: absolute;
  transform: rotate(-45deg) translateX(-50%) translateZ(0);
  transform-origin: left;
  top: 20%;
  left: 50%;
  background: ${props => props.theme.colors.secondaryBackground};
  border-radius: 4px;
  padding: 5px;
  z-index: 2;
  opacity: 0.6;
`;

const paginationButtonTheme = {
  colors: {
    buttonBg: "#eee",
    buttonBgHover: "transparent",
    buttonColorHover: "#999",
    buttonColor: "#999"
  }
};

const IssueDataGraph = class extends React.Component {
  render() {
    const [chartData, maxValue] = this.props.getChartData(this.props.issues);
    return (
      <Graph>
        <GraphTitle>
          <span>{this.props.title}</span>{" "}
          {this.props.fetching && <small>Loading...</small>}
        </GraphTitle>
        <GraphBars>
          {chartData.map(item => (
            <GraphBar
              loaded={this.props.loaded}
              key={item.name}
              barCount={chartData.length}
              maxValue={maxValue}
              {...item}
            >
              {this.props.showFloatingLabel && (
                <GraphBarFloatingLabel>{item.name}</GraphBarFloatingLabel>
              )}
            </GraphBar>
          ))}
        </GraphBars>
        <GraphExplanation>{this.props.explanation}</GraphExplanation>
        <GraphPaginationActions>
          {this.props.hasNext && (
            <Button
              small
              disabled={this.props.fetching}
              onClick={this.props.onLoadNextPage}
              theme={paginationButtonTheme}
            >
              Older issues
            </Button>
          )}
          {this.props.hasPrevious && (
            <Button
              small
              disabled={this.props.fetching}
              onClick={this.props.onLoadPreviousPage}
              theme={paginationButtonTheme}
            >
              Newer issues
            </Button>
          )}
        </GraphPaginationActions>
      </Graph>
    );
  }
};

const IssuesDataGraphSmartContainer = class extends React.Component {
  state = {
    cursors: []
  };

  loadNextPage = cursor => {
    this.setState({ cursors: [cursor, ...this.state.cursors] });
  };

  loadPreviousPage = () => {
    this.setState({ cursors: this.state.cursors.slice(1) });
  };

  render() {
    return (
      <Connect
        query={query(this.props.query, {
          login: this.props.login,
          cursor: this.state.cursors[0],
          queryType: this.props.queryType
        })}
      >
        {({ loaded, fetching, data, error }) => {
          const issues = loaded ? data.user.issues.edges : [];
          return (
            <IssueDataGraph
              {...this.props}
              issues={issues}
              loaded={loaded}
              fetching={fetching}
              hasNext={issues.length === this.props.pageSize}
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
export default IssuesDataGraphSmartContainer;
