import { Character } from "erbs-sdk";
import React from "react";
import { Segment, Grid, Header, Statistic, Item, Progress } from "semantic-ui-react";
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
    <>
      <Segment.Group horizontal style={{ background: "transparent" }}>
        <Segment
          basic
          compact
          style={{
            background: "rgba(55, 54, 54, 1)",
            border,
            boxShadow: "2px 2px 2px 0px rgba(255, 255, 255, 0.1)",
            maxWidth: "150px",
          }}
          textAlign="center"
        >
          <div>
            <RankComponent mmr={data.mmr} />
            <Header
              content={getRankLabel(data.mmr)}
              subheader={data.mmr + " LP"}
              size={"huge"}
              inverted={true}
              style={{ marginTop: 0 }}
            />
          </div>
        </Segment>
        <Segment
          basic
          compact
          style={{
            background: "rgba(55, 54, 54, 1)",
            marginLeft: "2em",
            border,
            boxShadow: "2px 2px 2px 0px rgba(255, 255, 255, 0.1)",
            maxWidth: "150px",
          }}
          textAlign="center"
        >
          <Header size="medium" inverted sty>
            {Math.round((data.totalWins / data.totalGames) * 100)}% Win Rate
          </Header>
          <WinRateChartComponent
            width={"120px"}
            totalWins={data.totalWins}
            totalGames={data.totalGames}
          />
          <Statistic.Group
            inverted={true}
            size="tiny"
            style={{ justifyContent: "center", marginTop: "2em" }}
          >
            <Statistic style={{ padding: 0, margin: 0 }}>
              <Statistic.Label>Games</Statistic.Label>
              <Statistic.Value>{data.totalGames}</Statistic.Value>
            </Statistic>
            <Statistic>
              <Statistic.Label>Wins</Statistic.Label>
              <Statistic.Value>{data.totalWins}</Statistic.Value>
            </Statistic>
          </Statistic.Group>
        </Segment>
        <Segment basic>
          <Segment.Group style={{ background: "transparent" }}>
            <Segment
              basic
              inverted
              style={{
                background: "rgba(55, 54, 54, 1)",
                border,
                boxShadow: "2px 2px 2px 0px rgba(255, 255, 255, 0.1)",
              }}
            >
              <Statistic.Group size="small" inverted={true} style={{ justifyContent: "center" }}>
                <Statistic>
                  <Statistic.Label>Top</Statistic.Label>
                  <Statistic.Value>{Math.round(data.rankPercent * 100)} %</Statistic.Value>
                </Statistic>
                <Statistic>
                  <Statistic.Label>Rank</Statistic.Label>
                  <Statistic.Value>{data.rank}</Statistic.Value>
                </Statistic>
                <Statistic>
                  <Statistic.Label>Out Of</Statistic.Label>
                  <Statistic.Value>{data.rankSize}</Statistic.Value>
                </Statistic>
              </Statistic.Group>
            </Segment>
            <Segment
              basic
              inverted
              textAlign="center"
              style={{
                background: "rgba(55, 54, 54, 1)",
                marginTop: "2em",
                border,
                boxShadow: "2px 2px 2px 0px rgba(255, 255, 255, 0.1)",
              }}
            >
              <Statistic.Group inverted={true} style={{ justifyContent: "center" }}>
                <Statistic>
                  <Statistic.Label>Average Kills</Statistic.Label>
                  <Statistic.Value>{data.averageKills}</Statistic.Value>
                </Statistic>
                <Statistic>
                  <Statistic.Label>Average Rank</Statistic.Label>
                  <Statistic.Value>{data.averageRank}</Statistic.Value>
                </Statistic>
                <Statistic>
                  <Statistic.Label>Average Hunts</Statistic.Label>
                  <Statistic.Value>{data.averageHunts}</Statistic.Value>
                </Statistic>
              </Statistic.Group>
            </Segment>
          </Segment.Group>
        </Segment>
        <Segment
          basic
          inverted
          style={{
            background: "rgba(55, 54, 54, 1)",
            border,
            boxShadow: "2px 2px 2px 0px rgba(255, 255, 255, 0.1)",
          }}
        >
          <Header size="tiny">Average Rankings</Header>
          <Progress
            inverted
            label="Top 2"
            percent={Math.round(data.top2 * 100)}
            progress="percent"
            color="red"
          />
          <Progress
            inverted
            label="Top 3"
            percent={Math.round(data.top3 * 100)}
            progress
            color="red"
          />
          <Progress
            inverted
            label="Top 5"
            percent={Math.round(data.top5 * 100)}
            progress
            color="red"
          />
          <Progress
            inverted
            label="Top 7"
            percent={Math.round(data.top7 * 100)}
            progress
            color="red"
          />
        </Segment>
      </Segment.Group>
      <Segment basic style={{ background: "transparent", padding: 0 }}>
        <Grid padded="vertically" centered style={{ padding: 0 }}>
          <Grid.Row>
            <Grid.Column width={15}>
              <Segment color="blue" inverted textAlign="center">
                <Header inverted>Top Played Characters</Header>
              </Segment>
            </Grid.Column>
          </Grid.Row>
          {data.characterStats.map((charStat, i) => {
            const character = new Character(charStat.characterCode);
            return (
              <Grid.Column
                width={7}
                style={{
                  background: "rgba(55, 54, 54, 1)",
                  margin: "1em",
                  border,
                  boxShadow: "2px 2px 2px 0px rgba(255, 255, 255, 0.1)",
                }}
              >
                <div
                  style={{
                    marginTop: "10px",
                    marginLeft: "10px",
                    marginRight: "10px",
                    float: "left",
                  }}
                >
                  <CharacterPortrait name={character.name} type="half" width={130} />
                </div>

                <Header inverted size="large" style={{ textAlign: "center" }}>
                  {character.name}
                </Header>

                <Segment basic style={{ padding: 0, margin: 0 }}>
                  <Statistic.Group
                    inverted={true}
                    size="tiny"
                    widths={16}
                    style={{ padding: 0, margin: 0 }}
                  >
                    <Statistic>
                      <Statistic.Label>Usage</Statistic.Label>
                      <Statistic.Value>
                        {Math.round((charStat.totalGames / data.totalGames) * 100)}%
                      </Statistic.Value>
                    </Statistic>
                    <Statistic>
                      <Statistic.Label>Most Kills</Statistic.Label>
                      <Statistic.Value>{charStat.maxKillings}</Statistic.Value>
                    </Statistic>
                    <Statistic>
                      <Statistic.Label>Avg Rank</Statistic.Label>
                      <Statistic.Value>{charStat.averageRank}</Statistic.Value>
                    </Statistic>
                    <Statistic>
                      <Statistic.Label>Top 3 Rate</Statistic.Label>
                      <Statistic.Value>{charStat.top3}</Statistic.Value>
                    </Statistic>
                    <Statistic>
                      <Statistic.Label>Games Played</Statistic.Label>
                      <Statistic.Value>{charStat.totalGames}</Statistic.Value>
                    </Statistic>
                    <Statistic>
                      <Statistic.Label>Wins</Statistic.Label>
                      <Statistic.Value>{charStat.wins}</Statistic.Value>
                    </Statistic>
                  </Statistic.Group>

                  <Statistic.Group inverted={true} size="tiny"></Statistic.Group>
                </Segment>
              </Grid.Column>
            );
          })}
        </Grid>
      </Segment>
    </>
  );
};
