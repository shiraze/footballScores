import "cross-fetch/polyfill";

export async function run(teamKey) {
  // See sample.json for structure of incoming data

  const data = await fetch(
    "https://s3.eu-west-1.amazonaws.com/hackajob-assets1.p.hackajob/challenges/football_session/football.json"
  ).then((results) => results.json());

  return data.rounds.reduce(
    (total, r) =>
      total +
      r.matches.reduce(
        (scores, m) =>
          scores +
          (m.team1.key === teamKey ? m.score1 : 0) +
          (m.team2.key === teamKey ? m.score2 : 0),
        0
      ),
    0
  );
}
