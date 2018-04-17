import React from "react";
import IssueDataGraph from "./IssueDataGraph";

const getCollaboratorsStats = (login, issues) =>
  issues
    .reduce((collaborators, issue) => {
      return [...collaborators, ...issue.node.participants.edges];
    }, [])
    .map(collaborator => collaborator.node.login)
    .filter(collaborator => collaborator !== login)
    .reduce((byCollaborator, collaborator) => {
      return {
        ...byCollaborator,
        [collaborator]: (byCollaborator[collaborator] || 0) + 1
      };
    }, {});

export const getChartData = login => issues => {
  const collaboratorStats = getCollaboratorsStats(login, issues);
  const chartData = Object.keys(collaboratorStats)
    .sort((a, b) => collaboratorStats[b] - collaboratorStats[a])
    .slice(0, 10)
    .map((collaborator, index) => ({
      name: collaborator,
      value: collaboratorStats[collaborator] || 0,
      color: collaboratorsToColor[index][0],
      emoji: collaboratorsToColor[index][1]
    }));
  const maxValue = chartData.reduce(
    (value, reaction) => (reaction.value > value ? reaction.value : value),
    0
  );
  return [chartData, maxValue];
};

const collaboratorsToColor = [
  ["#7B43A1", "🥇"],
  ["#43A19E", "🥈"],
  ["#F2317A", "🥉"],
  ["#58CF6C", "😭"],
  ["#58CF6C", "😂"],
  ["#58CF6C", "😂"],
  ["#58CF6C", "😂"],
  ["#58CF6C", "😂"],
  ["#58CF6C", "😂"],
  ["#58CF6C", "😒"]
];

const PAGE_SIZE = 100;
const CollaboratorsQuery = `
  query($login: String!, $cursor: String) {
    user(login: $login) {
      issues(first: ${PAGE_SIZE},  after: $cursor, orderBy: { field: CREATED_AT, direction: DESC }) {
        edges {
          cursor
          node {
            participants(first: 100) {
              edges {
                node {
                  login
                }
              }
            }
          }
        }
      }
    }
  }
`;

export default ({ login }) => (
  <IssueDataGraph
    query={CollaboratorsQuery}
    login={login}
    queryType="collaborators"
    getChartData={getChartData(login)}
    title="Top collaborators on issues"
    explanation={`Most frequent participants in issues opened by ${login}, per ${PAGE_SIZE} issues`}
    pageSize={PAGE_SIZE}
    showFloatingLabel
  />
);
