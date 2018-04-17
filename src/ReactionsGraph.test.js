import { getChartData } from "./ReactionsGraph";

const getReaction = reaction => ({
  node: { content: reaction }
});

const getIssue = (...reactions) => ({
  node: {
    reactions: {
      edges: reactions
    }
  }
});

describe("Extracting emoji stats from issues data", () => {
  it("works for no issues", () => {
    const issues = [];
    expect(getChartData(issues)).toEqual([
      [
        { color: "#43A19E", emoji: "👍", name: "THUMBS_UP", value: 0 },
        { color: "#7B43A1", emoji: "👎", name: "THUMBS_DOWN", value: 0 },
        { color: "#F2317A", emoji: "😄", name: "LAUGH", value: 0 },
        { color: "#FF9824", emoji: "🎉", name: "HOORAY", value: 0 },
        { color: "#58CF6C", emoji: "😕", name: "CONFUSED", value: 0 },
        { color: "#00c6fb", emoji: "❤️", name: "HEART", value: 0 }
      ],
      0
    ]);
  });

  it("works for issues with no reactions", () => {
    const issues = [
      getIssue(
        getReaction("HOORAY"),
        getReaction("LAUGH"),
        getReaction("HEART")
      ),
      getIssue()
    ];
    expect(getChartData(issues)).toEqual([
      [
        { color: "#43A19E", emoji: "👍", name: "THUMBS_UP", value: 0 },
        { color: "#7B43A1", emoji: "👎", name: "THUMBS_DOWN", value: 0 },
        { color: "#F2317A", emoji: "😄", name: "LAUGH", value: 1 },
        { color: "#FF9824", emoji: "🎉", name: "HOORAY", value: 1 },
        { color: "#58CF6C", emoji: "😕", name: "CONFUSED", value: 0 },
        { color: "#00c6fb", emoji: "❤️", name: "HEART", value: 1 }
      ],
      1
    ]);
  });

  it("works for multiple issues with multiple reactions", () => {
    const issues = [
      getIssue(
        getReaction("THUMBS_UP"),
        getReaction("THUMBS_UP"),
        getReaction("HEART")
      ),
      getIssue(
        getReaction("THUMBS_DOWN"),
        getReaction("HEART"),
        getReaction("CONFUSED"),
        getReaction("THUMBS_UP")
      )
    ];
    expect(getChartData(issues)).toEqual([
      [
        { color: "#43A19E", emoji: "👍", name: "THUMBS_UP", value: 3 },
        { color: "#7B43A1", emoji: "👎", name: "THUMBS_DOWN", value: 1 },
        { color: "#F2317A", emoji: "😄", name: "LAUGH", value: 0 },
        { color: "#FF9824", emoji: "🎉", name: "HOORAY", value: 0 },
        { color: "#58CF6C", emoji: "😕", name: "CONFUSED", value: 1 },
        { color: "#00c6fb", emoji: "❤️", name: "HEART", value: 2 }
      ],
      3
    ]);
  });
});
