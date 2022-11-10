import fetchMock from "fetch-mock";
import { run } from "./main";

describe("Solution", function () {
  afterEach(() => {
    fetchMock.restore();
  });

  it("should score an unknown team with zero from live data", async function () {
    const result = await run("unknown");
    expect(result).toBe(0);
  });

  it("should score an unknown team with zero from mocked data", async function () {
    fetchMock.mock("*", {
      name: "mocked data",
      rounds: [
        {
          name: "matchday 1",
          matches: [
            {
              date: "2014-08-16",
              team1: {
                key: "manutd",
                name: "Manchester United",
                code: "MUN",
              },
              team2: {
                key: "swansea",
                name: "Swansea",
                code: "SWA",
              },
              score1: 1,
              score2: 2,
            },
          ],
        },
      ],
    });
    const result = await run("unknown");
    expect(result).toBe(0);
  });

  it("score a team that has played one home game correctly", async function () {
    fetchMock.get("*", {
      name: "mocked data",
      rounds: [
        {
          name: "matchday 1",
          matches: [
            {
              date: "2014-08-16",
              team1: {
                key: "manutd",
                name: "Manchester United",
                code: "MUN",
              },
              team2: {
                key: "swansea",
                name: "Swansea",
                code: "SWA",
              },
              score1: 1,
              score2: 2,
            },
          ],
        },
      ],
    });
    const result = await run("manutd");
    expect(result).toBe(1);
  });

  it("score a team that has played one away game correctly", async function () {
    fetchMock.mock("*", {
      name: "mocked data",
      rounds: [
        {
          name: "matchday 1",
          matches: [
            {
              date: "2014-08-16",
              team1: {
                key: "manutd",
                name: "Manchester United",
                code: "MUN",
              },
              team2: {
                key: "swansea",
                name: "Swansea",
                code: "SWA",
              },
              score1: 1,
              score2: 2,
            },
          ],
        },
      ],
    });
    const result = await run("swansea");
    expect(result).toBe(2);
  });

  it("should score team correctly when it has played home and away multiple times", async function () {
    fetchMock.get("*", {
      name: "mocked data",
      rounds: [
        {
          name: "matchdays 1",
          matches: [
            {
              date: "2014-08-16",
              team1: {
                key: "manutd",
                name: "Manchester United",
                code: "MUN",
              },
              team2: {
                key: "swansea",
                name: "Swansea",
                code: "SWA",
              },
              score1: 1,
              score2: 2,
            },
            {
              date: "2014-08-17",
              team1: {
                key: "swansea",
                name: "Swansea",
                code: "SWA",
              },
              team2: {
                key: "manutd",
                name: "Manchester United",
                code: "MUN",
              },
              score1: 2,
              score2: 4,
            },
          ],
        },
        {
          name: "matchdays 2",
          matches: [
            {
              date: "2014-08-18",
              team1: {
                key: "manutd",
                name: "Manchester United",
                code: "MUN",
              },
              team2: {
                key: "qpr",
                name: "Queens Park Rangers",
                code: "QPR",
              },
              score1: 0,
              score2: 0,
            },
            {
              date: "2014-08-19",
              team1: {
                key: "leicester",
                name: "Leicester City",
                code: "LEI",
              },
              team2: {
                key: "manutd",
                name: "Manchester United",
                code: "MUN",
              },
              score1: 2,
              score2: 4,
            },
          ],
        },
      ],
    });
    const result = await run("manutd");
    expect(result).toBe(9);
  });

  it("should provide correct score for 'manutd' from live data", async function () {
    const result = await run("manutd");
    expect(result).toBe(62);
  });

  it("should provide correct score for 'burnley' from live data", async function () {
    const result = await run("burnley");
    expect(result).toBe(28);
  });
});
