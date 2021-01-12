import { Characters } from "erbs-sdk";
import React, { useContext, useState, useEffect } from "react";
import { Segment, Grid, Header, Container, Tab, Dropdown, Dimmer, Loader } from "semantic-ui-react";
import { useParams } from "react-router-dom";
import { PageComponent } from "../../components/page";
import { BG_HALF, BG_THIRD } from "../../utilities/bgImages";
import { CharacterPortrait } from "../../components/characterPortrait.component";
import { GameModes } from "erbs-client";
import { SeasonModeRankComponent, Seasons } from "./children/seasonModeRank.component";
import { DataContext } from "../../state/data";

const reverseCharLookup = Object.fromEntries(Object.entries(Characters).map(([k, v]) => [v, k]));

const timeSince = (timeStamp) => {
  var now = new Date(),
    secondsPast = (now.getTime() - timeStamp) / 1000;
  if (secondsPast < 60) {
    return secondsPast + "s ago";
  }
  if (secondsPast < 3600) {
    return Math.round(secondsPast) / 60 + "m ago";
  }
  if (secondsPast <= 86400) {
    return Math.round(secondsPast) / 3600 + "h ago";
  }
  if (secondsPast > 86400) {
    const day = timeStamp.getDate();
    const month = timeStamp
      .toDateString()
      .match(/ [a-zA-Z]*/)[0]
      .replace(" ", "");
    const year = timeStamp.getFullYear() === now.getFullYear() ? "" : " " + timeStamp.getFullYear();
    return day + " " + month + year;
  }
};

const PlayerView = () => {
  const { id } = useParams() as any;
  const [activeSeason, setSeason] = useState(0);
  const { getPlayerData, activePlayer } = useContext(DataContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>();

  useEffect(() => {
    if (id) {
      getPlayerData(id)
        .catch((e) => {
          setError(e);
        })
        .finally(() => setLoading(false));
    }
  }, [getPlayerData, id]);

  if (loading) {
    return (
      <PageComponent title="Eternal Return: Black Survival Test Subject Records">
        <Segment
          color="black"
          inverted
          placeholder
          style={{
            margin: 0,
            marginTop: 12,
            padding: 0,
            borderRadius: 0,
          }}
        >
          <Dimmer active>
            <Loader indeterminate>Fetching Player {id}</Loader>
          </Dimmer>
        </Segment>
      </PageComponent>
    );
  }

  if (!loading && !activePlayer) {
    return (
      <PageComponent title="Eternal Return: Black Survival Test Subject Records">
        <Segment
          color="yellow"
          inverted
          placeholder
          style={{
            margin: 0,
            marginTop: 12,
            padding: 0,
            borderRadius: 0,
          }}
        >
          <Header size="huge">Player Unavailable</Header>
          <p>
            Data was unable to be found for this player. If this player exists, it's most likely
            that we just haven't fetched this player before and we've queued up the requested
            player. Check back again in a short while to see player data here. If problems persist
            contact the admin on this app on discord: Paul Endri#2569
          </p>
          {error && <p>{error}</p>}
        </Segment>
      </PageComponent>
    );
  }

  const charsPlayed = activePlayer.seasonRecords
    .map((season) => season.info)
    .flat()
    .map(({ characterStats }) =>
      characterStats.map(({ characterCode, totalGames }) => [characterCode, totalGames])
    )
    .reduce((total, vals) => {
      const data = Object.fromEntries(total);

      vals.forEach(([code, count]) => {
        if (data[code]) {
          data[code] = data[code] + count;
        } else {
          data[code] = count;
        }
      });

      return Object.entries(data);
    }, [] as any)
    .sort((a, b) => b[1] - a[1]);

  const panes = activePlayer.seasonRecords
    .filter((season) => season.season === activeSeason)
    .map((season) => season.info)
    .flat()
    .map((data) => ({
      menuItem: GameModes[data.matchingTeamMode],
      render: () => <SeasonModeRankComponent data={data} />,
    }));

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
            style={{
              backgroundColor: "rgba(76, 70, 70, 1)",
              backgroundImage: BG_THIRD,
              borderBottom: "1px groove",
              borderTop: "1px groove",
            }}
            centered
          >
            <Grid.Column width={3}>
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <CharacterPortrait
                  type="mini"
                  margin={"0"}
                  width={100}
                  name={reverseCharLookup[charsPlayed[0][0]]}
                />
                {charsPlayed &&
                  charsPlayed.length > 0 &&
                  charsPlayed.slice(1, 5).map(([c]) => (
                    <div key={c} style={{ alignSelf: "flex-end" }}>
                      <CharacterPortrait width={51} type="mini" name={reverseCharLookup[c]} />
                    </div>
                  ))}
              </div>
            </Grid.Column>
            <Grid.Column width={3}>
              <div>
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
                  {activePlayer.name}
                </Header>
                <span style={{ marginLeft: "8px", fontSize: "smaller" }}>
                  Last Updated: {timeSince(new Date(activePlayer.lastUpdated).getTime())}
                </span>
              </div>
            </Grid.Column>
            <Grid.Column width={2}>
              <Segment compact style={{ alignSelf: "end", marginTop: "2.5em" }}>
                <Dropdown
                  value={activeSeason}
                  compact
                  onChange={(e, { value }) => setSeason(+value)}
                  options={Seasons}
                  placeholder="test"
                />
              </Segment>
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
                backgroundColor: "rgba(51, 49, 50, 0.8)",
                width: "100%",
              }}
            >
              <Tab
                menu={{
                  centered: true,
                  color: "yellow",
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
