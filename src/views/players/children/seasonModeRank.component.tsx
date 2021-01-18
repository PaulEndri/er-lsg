import { Character } from "erbs-sdk";
import React from "react";
import { Segment, Grid, Header, Statistic, Item } from "semantic-ui-react";
import { CharacterPortrait } from "../../../components/characterPortrait.component";
import { IS_MOBILE } from "../../../components/isMobile";
import { getRankLabel, RankComponent } from "../../../components/rank.component";
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
    <Segment.Group
      style={{
        border: 0,

        marginTop: 0,
        paddingTop: 0,
        background: "rgba(31, 29, 29, 0.2)",
      }}
    >
      <Segment basic style={{ display: "flex" }}>
        <Grid>
          <Grid.Row stretched>
            <Grid.Column width={4}>
              <RankComponent mmr={data.mmr} />
            </Grid.Column>
            <Grid.Column width={12}>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={9} style={{ paddingTop: "2rem", borderRight: border }}>
                    <Grid>
                      <Grid.Row>
                        <Grid.Column width={16}>
                          <Header
                            content={getRankLabel(data.mmr)}
                            subheader={data.mmr + " LP"}
                            size={"huge"}
                            inverted
                          />
                        </Grid.Column>
                      </Grid.Row>
                      <Grid.Row style={{ borderTop: border }}>
                        <Grid.Column width={16}>
                          <Statistic.Group inverted color="yellow">
                            <Statistic>
                              <Statistic.Label>Average Kills</Statistic.Label>
                              <Statistic.Value>{data.averageKills}</Statistic.Value>
                            </Statistic>
                            <Statistic>
                              <Statistic.Label>Top</Statistic.Label>
                              <Statistic.Value>
                                {Math.round(data.rankPercent * 100)} %
                              </Statistic.Value>
                            </Statistic>
                          </Statistic.Group>
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                  </Grid.Column>
                  <Grid.Column width={IS_MOBILE ? 9 : 7}>
                    <WinRateChartComponent
                      totalGames={data.totalGames}
                      totalWins={data.totalWins}
                    />
                    <Statistic.Group inverted size="tiny" style={{ justifyContent: "center" }}>
                      <Statistic style={{ padding: 0, margin: 0 }}>
                        <Statistic.Label>Games</Statistic.Label>
                        <Statistic.Value>{data.totalGames}</Statistic.Value>
                      </Statistic>
                      <Statistic>
                        <Statistic.Label>Wins</Statistic.Label>
                        <Statistic.Value>{data.totalWins}</Statistic.Value>
                      </Statistic>
                    </Statistic.Group>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row
            centered
            style={{ backgroundColor: "rgba(255, 250, 250, 0.1)", borderTop: border }}
          >
            <Statistic.Group
              size="tiny"
              inverted
              style={{ justifyContent: "center" }}
              color="yellow"
            >
              <Statistic>
                <Statistic.Label>Average Rank</Statistic.Label>
                <Statistic.Value>{data.averageRank}</Statistic.Value>
              </Statistic>

              <Statistic>
                <Statistic.Label>Average Hunts</Statistic.Label>
                <Statistic.Value>{data.averageHunts}</Statistic.Value>
              </Statistic>
              <Statistic>
                <Statistic.Label>Top 2</Statistic.Label>
                <Statistic.Value>{Math.round(data.top2 * 100)}%</Statistic.Value>
              </Statistic>
              <Statistic>
                <Statistic.Label>Top 3</Statistic.Label>
                <Statistic.Value>{Math.round(data.top3 * 100)}%</Statistic.Value>
              </Statistic>
              <Statistic>
                <Statistic.Label>Top 5</Statistic.Label>
                <Statistic.Value>{Math.round(data.top5 * 100)}%</Statistic.Value>
              </Statistic>
              {data.matchingTeamMode !== 3 && (
                <Statistic>
                  <Statistic.Label>Top 7</Statistic.Label>
                  <Statistic.Value>{Math.round(data.top7 * 100)}%</Statistic.Value>
                </Statistic>
              )}
            </Statistic.Group>
          </Grid.Row>
        </Grid>
      </Segment>
      <Segment basic>
        <Item.Group>
          {data.characterStats.map((charStat, i) => {
            const character = new Character(charStat.characterCode);
            return (
              <Item
                style={{
                  padding: "10px",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  marginTop: "10px",
                }}
              >
                <div style={{ marginTop: "10px", marginLeft: "10px", marginRight: "10px" }}>
                  <CharacterPortrait name={character.name} type="half" width={100} />
                </div>

                <Item.Content style={{ alignSelf: "center" }}>
                  <Item.Header style={{ color: "white" }}>{character.name}</Item.Header>
                  <Item.Description>
                    <Statistic.Group inverted color="yellow">
                      <Statistic>
                        <Statistic.Label>Most Kills</Statistic.Label>
                        <Statistic.Value>{charStat.maxKillings}</Statistic.Value>
                      </Statistic>
                      <Statistic>
                        <Statistic.Label>Top 3</Statistic.Label>
                        <Statistic.Value>{charStat.top3}</Statistic.Value>
                      </Statistic>
                      <Statistic>
                        <Statistic.Label>Average Rank</Statistic.Label>
                        <Statistic.Value>{charStat.averageRank}</Statistic.Value>
                      </Statistic>
                      <Statistic>
                        <Statistic.Label>Usage</Statistic.Label>
                        <Statistic.Value>
                          {Math.round((charStat.totalGames / data.totalGames) * 100)}%
                        </Statistic.Value>
                      </Statistic>
                    </Statistic.Group>
                  </Item.Description>
                </Item.Content>
                <Segment
                  basic
                  compact
                  floated="right"
                  style={{ margin: 0, padding: 0, marginBottom: 10 }}
                >
                  <WinRateChartComponent
                    width={"100px"}
                    totalWins={charStat.wins}
                    totalGames={charStat.totalGames}
                  />

                  <Statistic.Group inverted size="tiny" style={{ justifyContent: "center" }}>
                    <Statistic style={{ padding: 0, margin: 0 }}>
                      <Statistic.Label>Games</Statistic.Label>
                      <Statistic.Value>{charStat.totalGames}</Statistic.Value>
                    </Statistic>
                    <Statistic>
                      <Statistic.Label>Wins</Statistic.Label>
                      <Statistic.Value>{charStat.wins}</Statistic.Value>
                    </Statistic>
                  </Statistic.Group>
                </Segment>
              </Item>
            );
          })}
        </Item.Group>
      </Segment>
    </Segment.Group>
  );
};
