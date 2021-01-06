import { Armors, CharactersLookup, Locations, Weapons } from "erbs-sdk";
import React, { PureComponent, useState } from "react";
import {
  Segment,
  Menu,
  Grid,
  List,
  Label,
  Header,
  Statistic,
  Container,
  Tab,
} from "semantic-ui-react";
import { Link, Route, Switch, useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { PageComponent } from "../../components/page";
import { Characters } from "erbs-data";
import { CharacterLandingPage, CharacterPage } from "../wiki/children/characterPage.component";
import { WeaponPage } from "../wiki/children/weaponPage.component";
import { ArmorPage } from "../wiki/children/armorPage.component";
import { ItemPage } from "../wiki/children/itemPage.component";
import { LocationLandingPage, LocationPage } from "../wiki/children/locationPage.component";
import { BG_HALF, BG_THIRD } from "../../utilities/bgImages";
import { DefaultPlayerData } from "../../utilities/playerData";
import { CharacterPortrait } from "../../components/characterPortrait.component";
import { GameModes } from "erbs-client";
import { PieChart } from "react-minimal-pie-chart";

const reverseCharLookup = Object.fromEntries(
  Object.entries(CharactersLookup).map(([k, v]) => [v, k])
);

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
    <Grid centered>
      <Grid.Column width={8}>
        <Segment fluid style={{ borderRadius: 0 }}>
          <div style={{ width: "100px" }}>
            <PieChart
              data={gamesData}
              lineWidth={20}
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
          <Statistic.Group>
            <Statistic>
              <Statistic.Label>Wins</Statistic.Label>
              <Statistic.Value>{data.totalWins}</Statistic.Value>
            </Statistic>
            <Statistic>
              <Statistic.Label>Games</Statistic.Label>
              <Statistic.Value>{data.totalGames}</Statistic.Value>
            </Statistic>
            <Statistic>
              <Statistic.Label>MMR</Statistic.Label>
              <Statistic.Value>{data.mmr}</Statistic.Value>
            </Statistic>
            <Statistic>
              <Statistic.Label>%ile</Statistic.Label>
              <Statistic.Value>{100 - data.rankPercent * 100}</Statistic.Value>
            </Statistic>
          </Statistic.Group>
          <Header>Averages</Header>
          <Statistic.Group size="small">
            <Statistic>
              <Statistic.Label>Placement</Statistic.Label>
              <Statistic.Value>{data.averageRank}</Statistic.Value>
            </Statistic>
            <Statistic>
              <Statistic.Label>Kills</Statistic.Label>
              <Statistic.Value>{data.averageKills}</Statistic.Value>
            </Statistic>
            <Statistic>
              <Statistic.Label>Hunts</Statistic.Label>
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
          </Statistic.Group>
        </Segment>
      </Grid.Column>
    </Grid>
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
        fluid
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
            }}
            centered
          >
            <Grid.Column width={1} stretched mobile={6} tablet={4} computer={2}>
              <CharacterPortrait
                type="half"
                width={125}
                name={reverseCharLookup[charsPlayed[0][0]]}
              />
            </Grid.Column>
            <Grid.Column width={3} style={{ paddingLeft: 0 }} tablet={6} mobile={8} computer={3}>
              <Grid>
                <Grid.Row
                  stretched
                  style={{
                    paddingLeft: "1rem",
                    paddingTop: 25,
                    paddingBottom: 0,
                  }}
                >
                  <Header inverted as="h1">
                    Paul Endri
                  </Header>
                </Grid.Row>
                <Grid.Row
                  style={{
                    padding: 0,
                    paddingLeft: "3.5rem",

                    margin: 0,
                  }}
                >
                  {activeSeason ? `Season ${activeSeason}` : "Offseason"}
                </Grid.Row>
                <Grid.Row style={{ marginTop: 0, paddingTop: 0 }}>
                  {charsPlayed.slice(1, 3).map(([c]) => (
                    <Grid.Column tablet={8} mobile={8} computer={6} widescreen={4} key={c}>
                      <CharacterPortrait width={75} type="mini" name={reverseCharLookup[c]} />
                    </Grid.Column>
                  ))}
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
      <Container fluid>
        <Grid centered>
          <Grid.Column width={16}>
            <Segment
              style={{
                padding: 1,
                paddingTop: 0,
                borderTop: 0,
                backgroundColor: "rgba(51, 51, 51, 0.8)",
              }}
              basic
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
