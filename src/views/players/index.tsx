import { Characters } from "erbs-sdk";
import React, { useContext } from "react";
import { Segment, Grid, Header, Container, Tab, Dropdown, Dimmer, Loader } from "semantic-ui-react";
import { useParams } from "react-router-dom";
import { PageComponent } from "../../components/page";
import { CharacterPortrait } from "../../components/characterPortrait.component";
import { GameModes } from "erbs-client";
import { SeasonModeRankComponent, Seasons } from "./children/seasonModeRank.component";
import { DataContext } from "../../state/data";
import { IS_MOBILE } from "../../components/isMobile";
import { MatchInfoComponent } from "./children/matchItem.component";
// import { DefaultPlayerData } from "../../utilities/playerData";

const reverseCharLookup = Object.fromEntries(Object.entries(Characters).map(([k, v]) => [v, k]));

const timeSince = (timeStamp) => {
  var now = new Date(),
    secondsPast = (now.getTime() - timeStamp) / 1000;
  if (secondsPast < 60) {
    return secondsPast + "s ago";
  }
  if (secondsPast < 3600) {
    return Math.round(secondsPast / 60) + "m ago";
  }
  if (secondsPast <= 86400) {
    return Math.round(secondsPast / 3600) + "h ago";
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

type Props = {
  id: string;
  activePlayer: any;
  getPlayerData: (id) => Promise<any>;
};

type State = {
  activeSeason: number;
  loading: boolean;
  loadingMessage: string;
  error: any;
};

class PlayerContent extends React.PureComponent<Props, State> {
  state = {
    activeSeason: 0,
    loading: true,
    loadingMessage: null,
    error: null,
  };

  componentDidMount() {
    const { id, activePlayer } = this.props;

    if (id && !activePlayer) {
      this.processPlayer();
    } else if (id) {
      this.setState({ loading: false });
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    const { id, activePlayer } = this.props;

    if (nextProps.id !== id || nextProps.activePlayer !== activePlayer) {
      return true;
    }

    const { activeSeason, loading, error } = this.state;

    if (
      activeSeason !== nextState.activeSeason ||
      loading !== nextState.loading ||
      error !== nextState.error
    ) {
      return true;
    }

    return false;
  }

  componentDidUpdate(previousProps: Props) {
    if (this.props.id !== previousProps.id) {
      this.processPlayer();
    }
  }

  processPlayer(retry = true) {
    const { id, getPlayerData } = this.props;

    this.setState({ loading: true });

    return getPlayerData(id)
      .then((data) => {
        if (!data || !data.id) {
          this.setState({
            loadingMessage:
              "This user does not exist yet in our databases, fetching them now. Please wait",
          });

          if (retry) {
            setTimeout(
              () => this.processPlayer(false).then(() => this.setState({ loadingMessage: null })),
              1500
            );
          }
        } else {
          this.setState({ loading: false });
        }
      })
      .catch((e) => {
        this.setState({ error: e, loading: false });
      });
  }

  updateSeason(val: number) {
    this.setState({ activeSeason: val });
  }

  getCharsPlayed() {
    const { activePlayer } = this.props;
    // const activePlayer = DefaultPlayerData;

    return activePlayer.seasonRecords
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
  }

  render() {
    const { id, activePlayer } = this.props;
    const { activeSeason, loading, error, loadingMessage } = this.state;
    // const activePlayer = DefaultPlayerData;

    if (loading) {
      return (
        <PageComponent title="Eternal Return: Black Survival Test Subject Records">
          <Segment
            color="black"
            inverted={true}
            placeholder
            style={{
              margin: 0,
              marginTop: 12,
              padding: 0,
            }}
          >
            <Dimmer active>
              <Loader indeterminate>
                Fetching Player {id}
                <br />
                <div>{loadingMessage}</div>
              </Loader>
            </Dimmer>
          </Segment>
        </PageComponent>
      );
    }

    if (!loading && !activePlayer) {
      return (
        <PageComponent title="Eternal Return: Black Survival Test Subject Records">
          <Segment
            inverted={true}
            placeholder
            style={{
              margin: 0,
              marginTop: 12,
              padding: 0,
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

    if (!activePlayer || !activePlayer.seasonRecords || activePlayer.seasonRecords.length === 0) {
      return (
        <PageComponent title="Eternal Return: Black Survival Test Subject Records">
          <Segment
            inverted={true}
            placeholder
            style={{
              margin: 0,
              marginTop: 12,
              padding: 0,
            }}
          >
            <Header size="huge">Player Data Missing</Header>
            <p>
              We have no recorded game information for this player, but they have been queued up for
              a refresh, check back shortly. The user was last updated{" "}
              {timeSince(new Date(activePlayer.lastUpdated))}
            </p>
          </Segment>
        </PageComponent>
      );
    }

    const charsPlayed = this.getCharsPlayed();
    const matchHistory = (
      <>
        {activePlayer?.games?.map((data, i) => (
          <MatchInfoComponent data={data} key={i} />
        ))}
      </>
    );

    const panes =
      activePlayer?.seasonRecords
        ?.filter((season) => season.season === activeSeason)
        .map((season) => season.info)
        .flat()
        .map((data) => ({
          menuItem: GameModes[data.matchingTeamMode],
          render: () => <SeasonModeRankComponent data={data} />,
        })) || [];

    panes.push({
      menuItem: "Match History",
      render: () => matchHistory,
    });

    return (
      <PageComponent title="Eternal Return: Black Survival Test Subject Records">
        <Container>
          <Grid centered>
            <Grid.Row
              style={{
                marginTop: "1em",
                borderBottom: "1px groove",
                backgroundColor: "rgba(125, 120, 120, 1)",
              }}
              centered
            >
              <Grid.Column width={IS_MOBILE ? 14 : 6}>
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
              <Grid.Column width={IS_MOBILE ? 7 : 4} style={{ alignSelf: "center" }}>
                <div>
                  <Header
                    inverted={true}
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
                  <span style={{ marginLeft: "8px", fontSize: "smaller", color: "white" }}>
                    Last Updated: {timeSince(new Date(activePlayer.lastUpdated))}
                  </span>
                </div>
              </Grid.Column>
              <Grid.Column style={{ alignSelf: "flex-end" }} width={IS_MOBILE ? 7 : 6}>
                <Segment compact style={{ float: "right" }}>
                  <Dropdown
                    value={activeSeason}
                    compact
                    onChange={(e, { value }) => this.updateSeason(+value)}
                    options={Seasons}
                    placeholder="test"
                  />
                </Segment>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row style={{ padding: 0 }}>
              <Grid.Column width={16} style={{ paddingLeft: 0, paddingRight: 0 }}>
                <Segment
                  style={{
                    padding: 0,
                    borderTop: 0,
                    width: "100%",
                    background: "transparent",
                  }}
                >
                  <Tab
                    menu={{
                      centered: true,
                      color: "teal",
                      tertiary: true,
                      inverted: true,
                      attached: true,
                      style: { justifyContent: "center" },
                    }}
                    panes={panes}
                  />
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </PageComponent>
    );
  }
}
const PlayerView = () => {
  const { id } = useParams() as any;
  const { getPlayerData, activePlayer } = useContext(DataContext);

  return <PlayerContent id={id} activePlayer={activePlayer} getPlayerData={getPlayerData} />;
};

export default PlayerView;
