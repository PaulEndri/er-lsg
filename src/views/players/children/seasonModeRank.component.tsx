import { Character } from "erbs-sdk";
import React from "react";
import { Segment, Grid, Header, Progress, Table, Statistic } from "semantic-ui-react";
import { CharacterPortrait } from "../../../components/characterPortrait.component";
import { IS_MOBILE } from "../../../components/isMobile";
import { getRankLabel, RankComponent } from "../../../components/rank.component";
import { StatCardComponent } from "../../../components/statCard.component";
import { WinRateChartComponent } from "./winRateChart.component";

export const Seasons = [
  {
    text: "Season One",
    value: 1,
  },
  {
    text: "Unranked",
    value: 0,
  },
];
const border = "2px inset rgba(200, 200, 200, 0.2)";
export const SeasonModeRankComponent = ({ data }) => {
  return (
    <Segment basic style={{ background: "rgba(30, 28, 25, 0.8)", marginTop: 0 }}>
      <Grid style={{ padding: 0 }}>
        <Grid.Column desktop={6} tablet={16} mobile={16} widescreen={6} style={{ paddingTop: 0 }}>
          <Segment.Group
            horizontal
            style={{ background: "transparent", padding: 0, marginTop: "1em" }}
          >
            <StatCardComponent title="Ranking">
              <div style={{ textAlign: "center" }}>
                <Header
                  content={getRankLabel(data.mmr)}
                  subheader={data.mmr + " LP"}
                  size={"huge"}
                  inverted={true}
                  style={{ marginTop: 0 }}
                />
                <RankComponent mmr={data.mmr} />
              </div>
            </StatCardComponent>
            <StatCardComponent title={`Win Rate`} style={{ marginLeft: "2em", paddingTop: "10" }}>
              <WinRateChartComponent
                style={{ paddingTop: "10px" }}
                width={"130px"}
                title={`${Math.round((data.totalWins / data.totalGames) * 100)}%`}
                totalWins={data.totalWins}
                totalGames={data.totalGames}
              />
              <Table inverted celled structured striped style={{ marginTop: "2em" }}>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>Games</Table.Cell>
                    <Table.Cell>{data.totalGames}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Wins</Table.Cell>
                    <Table.Cell>{data.totalWins}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Losses</Table.Cell>
                    <Table.Cell>{data.totalGames - data.totalWins}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </StatCardComponent>
          </Segment.Group>

          <StatCardComponent title="Average Placements" textAlign="left">
            <div style={{ padding: "1em" }}>
              <Progress
                inverted
                label="Top 2"
                percent={Math.round(data.top2 * 100)}
                progress="percent"
                color="green"
              />
              <Progress
                inverted
                label="Top 3"
                percent={Math.round(data.top3 * 100)}
                progress
                color="green"
              />
              <Progress
                inverted
                label="Top 5"
                percent={Math.round(data.top5 * 100)}
                progress
                color="green"
              />
              <Progress
                inverted
                label="Top 7"
                percent={Math.round(data.top7 * 100)}
                progress
                color="green"
              />
            </div>
          </StatCardComponent>
          <StatCardComponent title="Statistics" textAlign="left">
            <Table inverted celled structured striped>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Average Kills</Table.Cell>
                  <Table.Cell>{data.averageKills}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Average Rank</Table.Cell>
                  <Table.Cell>{data.averageRank}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Average Hunts</Table.Cell>
                  <Table.Cell>{data.averageHunts}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>In the Top</Table.Cell>
                  <Table.Cell>{Math.round(data.rankPercent * 100)} %</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Player Rank</Table.Cell>
                  <Table.Cell>{data.rank}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Total Players in Rank</Table.Cell>
                  <Table.Cell>{data.rankSize}</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </StatCardComponent>
        </Grid.Column>

        <Grid.Column desktop={10} tablet={16} mobile={16} widescreen={10}>
          <div>
            <Segment color="blue" inverted textAlign="center">
              <Header inverted>Top Played Characters</Header>
            </Segment>
          </div>
          <Grid columns={4}>
            {data.characterStats.map((charStat, i) => {
              const character = new Character(charStat.characterCode);
              return (
                <Grid.Row
                  style={{
                    background: "rgba(55, 54, 54, 1)",
                    margin: "1em",
                    border,
                    boxShadow: "2px 2px 2px 0px rgba(255, 255, 255, 0.1)",
                  }}
                  stretched
                >
                  <Grid.Column floated="left">
                    <div style={{ margin: "auto" }}>
                      <CharacterPortrait
                        name={character.name}
                        type="half"
                        width={IS_MOBILE ? 80 : 120}
                      />
                    </div>
                  </Grid.Column>
                  <Grid.Column>
                    <Statistic.Group size="mini" widths={1}>
                      <Statistic inverted>
                        <Statistic.Label>Most Kills</Statistic.Label>
                        <Statistic.Value>{charStat.maxKillings}</Statistic.Value>
                      </Statistic>
                      <Statistic inverted>
                        <Statistic.Label>Games Played</Statistic.Label>
                        <Statistic.Value>{charStat.totalGames}</Statistic.Value>
                      </Statistic>
                      <Statistic inverted>
                        <Statistic.Label>Wins</Statistic.Label>
                        <Statistic.Value>{charStat.wins}</Statistic.Value>
                      </Statistic>
                    </Statistic.Group>
                  </Grid.Column>
                  <Grid.Column>
                    <Statistic.Group size="mini" widths={1}>
                      <Statistic inverted size="tiny">
                        <Statistic.Label>Avg Rank</Statistic.Label>
                        <Statistic.Value>{charStat.averageRank}</Statistic.Value>
                      </Statistic>
                      <Statistic inverted size="tiny">
                        <Statistic.Label>Games in Top 3</Statistic.Label>
                        <Statistic.Value>{charStat.top3}</Statistic.Value>
                      </Statistic>
                    </Statistic.Group>
                  </Grid.Column>
                  <Grid.Column>
                    <WinRateChartComponent
                      width={IS_MOBILE ? "60px" : "110px"}
                      totalWins={charStat.totalGames}
                      totalGames={data.totalGames}
                      title={"Usage"}
                    />
                    <Header inverted style={{ margin: 0, padding: 0, textAlign: "center" }}>
                      {Math.round((charStat.totalGames / data.totalGames) * 100)}%
                    </Header>
                  </Grid.Column>
                </Grid.Row>
              );
            })}
          </Grid>
        </Grid.Column>
      </Grid>
    </Segment>
  );
};
