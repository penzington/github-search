import React from "react";
import IssueDataGraph from "./IssueDataGraph";

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

export const getChartData = issues => {
  const emojiStats = getEmojiStats(issues);
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
  return [chartData, maxValue];
};

const reactions = {
  THUMBS_UP: ["#43A19E", "👍"],
  THUMBS_DOWN: ["#7B43A1", "👎"],
  LAUGH: ["#F2317A", "😄"],
  HOORAY: ["#FF9824", "🎉"],
  CONFUSED: ["#58CF6C", "😕"],
  HEART: ["#00c6fb", "❤️"]
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

export default ({ login }) => (
  <IssueDataGraph
    query={ReactionsQuery}
    login={login}
    queryType="reactions"
    getChartData={getChartData}
    title="Reactions to Issues"
    explanation={`Reactions to issues opened by ${login}, per ${PAGE_SIZE} issues`}
    pageSize={PAGE_SIZE}
  />
);
