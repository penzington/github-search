import { getChartData } from "./TopCollaboratorsGraph";

const getParticipant = login => ({
  node: { login }
});

const getIssue = (...participants) => ({
  node: {
    participants: {
      edges: participants
    }
  }
});

describe("Extracting collaborator stats from issues data", () => {
  it("works for no issues", () => {
    const issues = [];
    expect(getChartData("thisuser")(issues)).toEqual([[], 0]);
  });

  it("works for issues with no collaborators", () => {
    const issues = [
      getIssue(
        getParticipant("user1"),
        getParticipant("user3"),
        getParticipant("user2")
      ),
      getIssue()
    ];
    expect(getChartData("thisuser")(issues)).toEqual([
      [
        { color: "#7B43A1", emoji: "🥇", name: "user1", value: 1 },
        { color: "#43A19E", emoji: "🥈", name: "user3", value: 1 },
        { color: "#F2317A", emoji: "🥉", name: "user2", value: 1 }
      ],
      1
    ]);
  });

  it("filters out current user", () => {
    const issues = [
      getIssue(
        getParticipant("user1"),
        getParticipant("user3"),
        getParticipant("user2"),
        getParticipant("thisuser")
      )
    ];
    expect(getChartData("thisuser")(issues)).toEqual([
      [
        { color: "#7B43A1", emoji: "🥇", name: "user1", value: 1 },
        { color: "#43A19E", emoji: "🥈", name: "user3", value: 1 },
        { color: "#F2317A", emoji: "🥉", name: "user2", value: 1 }
      ],
      1
    ]);
  });

  it("works for multiple issues with multiple collaborators", () => {
    const issues = [
      getIssue(
        getParticipant("user1"),
        getParticipant("user2"),
        getParticipant("user3")
      ),
      getIssue(
        getParticipant("user1"),
        getParticipant("user4"),
        getParticipant("user5"),
        getParticipant("user6")
      ),
      getIssue(
        getParticipant("user6"),
        getParticipant("user7"),
        getParticipant("user8"),
        getParticipant("user9")
      ),
      getIssue(
        getParticipant("user9"),
        getParticipant("user10"),
        getParticipant("user11"),
        getParticipant("user1")
      )
    ];
    expect(getChartData("thisuser")(issues)).toEqual([
      [
        { color: "#7B43A1", emoji: "🥇", name: "user1", value: 3 },
        { color: "#43A19E", emoji: "🥈", name: "user6", value: 2 },
        { color: "#F2317A", emoji: "🥉", name: "user9", value: 2 },
        { color: "#58CF6C", emoji: "😭", name: "user4", value: 1 },
        { color: "#58CF6C", emoji: "😂", name: "user5", value: 1 },
        { color: "#58CF6C", emoji: "😂", name: "user2", value: 1 },
        { color: "#58CF6C", emoji: "😂", name: "user7", value: 1 },
        { color: "#58CF6C", emoji: "😂", name: "user8", value: 1 },
        { color: "#58CF6C", emoji: "😂", name: "user3", value: 1 },
        { color: "#58CF6C", emoji: "😒", name: "user10", value: 1 }
      ],
      3
    ]);
  });
});
