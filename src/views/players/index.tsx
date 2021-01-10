import { Characters } from "erbs-sdk";
import React, { useState } from "react";
import { Segment, Grid, Header, Container, Tab } from "semantic-ui-react";
import { useLocation, useRouteMatch } from "react-router-dom";
import { PageComponent } from "../../components/page";
import { BG_HALF, BG_THIRD } from "../../utilities/bgImages";
import { DefaultPlayerData } from "../../utilities/playerData";
import { CharacterPortrait } from "../../components/characterPortrait.component";
import { GameModes } from "erbs-client";
import { PieChart } from "react-minimal-pie-chart";
import { getRankLabel, RankComponent } from "../../components/rank.component";

const reverseCharLookup = Object.fromEntries(Object.entries(Characters).map(([k, v]) => [v, k]));

const ColorRankMap = {
  [GameModes.Solo]: "orange",
  [GameModes.Duos]: "red",
  [GameModes.Squads]: "brown",
};

const SeasonModeRankComponent = ({ data }) => {
  const gamesData = [
    {
      title: "Other Games",
      value: data.totalGames - data.totalWins,
      color: "#666666",
    },
    { title: "Games Won", value: data.totalWins, color: "#00FF00" },
  ];

  return (
    <Segment.Group style={{ border: 0, borderRadius: 0, background: "rgba(31, 29, 29, 0.2)" }}>
      <Segment
        inverted
        style={{ border: 0, borderRadius: 0 }}
        color={ColorRankMap[data.matchingTeamMode]}
      >
        <Header>{GameModes[data.matchingTeamMode]}</Header>
      </Segment>
      <Segment basic style={{ display: "flex" }}>
        <Grid style={{ width: "100%" }}>
          <Grid.Row>
            <Grid.Column width={4}>
              <RankComponent mmr={data.mmr} />
            </Grid.Column>
            <Grid.Column width={12}>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={6}>
                    <Header
                      content={getRankLabel(data.mmr)}
                      subheader={data.mmr + " LP"}
                      size={"huge"}
                      inverted
                    />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width={3}>
                    <div style={{ width: "100px" }}>
                      <PieChart
                        data={gamesData}
                        lineWidth={15}
                        totalValue={data.totalGames}
                        labelPosition={0}
                        paddingAngle={5}
                        label={({ dataEntry }) =>
                          Math.round((data.totalWins / data.totalGames) * 100) + "% Win"
                        }
                      >
                        Test
                      </PieChart>
                    </div>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </Segment.Group>
    // <Grid centered>
    //   <Grid.Column width={12} style={{ margin: 0, paddingLeft: 0, paddingRight: 0 }}>
    //     <Segment basic fluid style={{ borderRadius: 0 }}>
    //       <div style={{ width: "100px" }}>

    //       </div>
    //       <Segment>
    //         <RankComponent mmr={data.mmr} />
    //         <Statistic.Group>
    //           <Statistic>
    //             <Statistic.Value>{data.totalWins}</Statistic.Value>
    //             <Statistic.Label>Wins</Statistic.Label>
    //           </Statistic>
    //           <Statistic>
    //             <Statistic.Value>{data.totalGames}</Statistic.Value>
    //             <Statistic.Label>Games</Statistic.Label>
    //           </Statistic>
    //           <Statistic>
    //             <Statistic.Label>MMR</Statistic.Label>
    //             <Statistic.Value>{data.mmr}</Statistic.Value>
    //           </Statistic>
    //           <Statistic>
    //             <Statistic.Label>%ile</Statistic.Label>
    //             <Statistic.Value>{100 - data.rankPercent * 100}</Statistic.Value>
    //           </Statistic>
    //         </Statistic.Group>
    //       </Segment>

    //       <Segment></Segment>

    //       <Header>Averages</Header>
    //       <Statistic.Group size="small">
    //         <Statistic>
    //           <Statistic.Label>Placement</Statistic.Label>
    //           <Statistic.Value>{data.averageRank}</Statistic.Value>
    //         </Statistic>
    //         <Statistic>
    //           <Statistic.Label>Kills</Statistic.Label>
    //           <Statistic.Value>{data.averageKills}</Statistic.Value>
    //         </Statistic>
    //         <Statistic>
    //           <Statistic.Label>Hunts</Statistic.Label>
    //           <Statistic.Value>{data.averageHunts}</Statistic.Value>
    //         </Statistic>
    //         <Statistic>
    //           <Statistic.Label>Top 2</Statistic.Label>
    //           <Statistic.Value>{Math.round(data.top2 * 100)}%</Statistic.Value>
    //         </Statistic>
    //         <Statistic>
    //           <Statistic.Label>Top 3</Statistic.Label>
    //           <Statistic.Value>{Math.round(data.top3 * 100)}%</Statistic.Value>
    //         </Statistic>
    //         <Statistic>
    //           <Statistic.Label>Top 5</Statistic.Label>
    //           <Statistic.Value>{Math.round(data.top5 * 100)}%</Statistic.Value>
    //         </Statistic>
    //       </Statistic.Group>
    //     </Segment>
    //   </Grid.Column>
    // </Grid>
  );
};

const PlayerView = () => {
  const location = useLocation();
  const { path, url } = useRouteMatch();
  const [activeSeason, setSeason] = useState(0);

  const charsPlayed = DefaultPlayerData.map(({ characterStats }) =>
    characterStats.map(({ characterCode, totalGames }) => [characterCode, totalGames])
  )
    .reduce((total, vals) => {
      const data = Object.fromEntries(total);

      vals.map(([code, count]) => {
        if (data[code]) {
          data[code] = data[code] + count;
        } else {
          data[code] = count;
        }
      });

      return Object.entries(data);
    }, [] as any)
    .sort((a, b) => b[1] - a[1]);

  const panes = DefaultPlayerData.map((data) => ({
    menuItem: GameModes[data.matchingTeamMode],
    render: () => <SeasonModeRankComponent data={data} />,
  }));

  console.log("[test]", panes);
  return (
    <PageComponent title="Eternal Return: Black Survival Test Subject Records">
      <Segment
        color="black"
        inverted
        style={{
          margin: 0,
          marginTop: 12,
          padding: 0,
          borderRadius: 0,
        }}
      >
        <Grid style={{ backgroundImage: BG_HALF }} centered>
          <Grid.Row
            stretched
            style={{
              backgroundColor: "rgba(76, 70, 70, 1)",
              backgroundImage: BG_THIRD,
              borderBottom: "1px groove",
              borderTop: "1px groove",
              padding: 0,
            }}
            centered
          >
            <Grid.Column
              width={8}
              style={{
                backgroundColor: "rgba(31, 30, 30, 0.7)",
                display: "flex !important",
                flexDirection: "row",
                padding: "1rem",
                paddingTop: "1.5rem",
                paddingBottom: "1rem",
              }}
            >
              <CharacterPortrait
                type="mini"
                margin={"0"}
                width={100}
                name={reverseCharLookup[charsPlayed[0][0]]}
              />

              <div style={{ width: "100%" }}>
                <Header
                  inverted
                  size="large"
                  style={{
                    marginBottom: 0,
                    paddingLeft: "1rem",
                    fontSize: "50px",
                    textAlign: "left",
                    paddingTop: "8px",
                  }}
                >
                  Paul Endri
                </Header>
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  {charsPlayed.slice(1, 5).map(([c]) => (
                    <div key={c}>
                      <CharacterPortrait width={51} type="mini" name={reverseCharLookup[c]} />
                    </div>
                  ))}
                </div>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
      <Container fluid>
        <Grid centered>
          <Grid.Column width={8} style={{ paddingLeft: 0, paddingRight: 0 }}>
            <Segment
              style={{
                padding: 1,
                paddingTop: 0,
                borderTop: 0,
                backgroundColor: "rgba(51, 51, 51, 0.8)",
                width: "100%",
              }}
            >
              <Tab
                menu={{
                  centered: true,
                  color: "orange",
                  tertiary: true,
                  inverted: true,
                  attached: true,
                  style: { justifyContent: "center" },
                }}
                panes={panes}
              />
            </Segment>
          </Grid.Column>
        </Grid>
      </Container>
    </PageComponent>
  );
};

export default PlayerView;
