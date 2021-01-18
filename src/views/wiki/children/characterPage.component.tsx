import { Character, ICharacter } from "erbs-sdk";
import React, { useState } from "react";
import {
  Button,
  Image,
  Segment,
  Grid,
  Container,
  Tab,
  Icon,
  TransitionGroup,
  Statistic,
  Rating,
  Table,
  Header,
  Label,
} from "semantic-ui-react";
import { Link, useHistory, useParams } from "react-router-dom";
import CharacterThumbnailComponent from "../../../components/characterThumbnail.component";
import { CharacterStatTable } from "./characterStatTable.component";
import { getImageSrc } from "../../../utilities/getImageSrc";
import { AttributeChartComponent } from "../../../components/attributeChart.component";
import { CharacterPortrait } from "../../../components/characterPortrait.component";
import { ReverseWeaponsLookupKeyed } from "../../../utilities/reverseWeaponLookup";
import { ItemModalButton } from "../../../components/itemModalButton.component";
import { BG_THIRD } from "../../../utilities/bgImages";
import { getList } from "../../../utilities/getList";
import IsDesktop, { IS_DESKTOP } from "../../../components/isDesktop";
import IsMobile, { IS_MOBILE } from "../../../components/isMobile";

const CharacterAttrStatistic = ({ attr }) => (
  <Statistic inverted>
    <Statistic.Value>
      <Image
        wrapped
        size="small"
        style={{
          maxHeight: "auto",
          width: "50px",
        }}
        src={getImageSrc(`Weapon${attr.mastery}`)}
      />
    </Statistic.Value>
    <Statistic.Label>
      <Rating disabled icon="star" defaultRating={attr.controlDifficulty} maxRating={3} />
    </Statistic.Label>
  </Statistic>
);

const CharacterView: React.FC = ({ children }) => {
  const { id } = useParams() as any;
  const history = useHistory();
  const [minimized, setMinimized] = useState(false);
  const showBar = !minimized || (minimized && !id);

  return (
    <Container fluid>
      <div>
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.11)",
            display: "flex",
            flexFlow: "row wrap",
            justifyContent: "center",
          }}
        >
          <TransitionGroup animation="fade down" duration={60}>
            {showBar &&
              Object.keys(Character.SOURCES).map((character) => (
                <div key={character} style={{ marginRight: "4px" }}>
                  <CharacterThumbnailComponent
                    width={60}
                    name={character}
                    isActive={id && id === character}
                    onClick={() => history.push(`/wiki/characters/${character}`)}
                  />
                </div>
              ))}
          </TransitionGroup>

          {id && (
            <Button
              style={{ width: "100%", margin: 0 }}
              compact={!minimized}
              onClick={() => setMinimized(!minimized)}
              color="red"
            >
              <Icon name={`chevron ${!showBar ? "down" : "up"}` as any} />
              {!showBar ? "Show Character Selector" : "Minimize"}
            </Button>
          )}
        </div>
      </div>

      <Container>{children}</Container>
    </Container>
  );
};

export const CharacterPage = () => {
  const { id } = useParams() as any;
  const character = id ? new Character(id) : null;

  const panes = !character
    ? []
    : [
        {
          menuItem: "Lore",
          render: () => (
            <Grid centered={IS_DESKTOP}>
              <Grid.Column
                mobile={14}
                desktop={6}
                widescreen={6}
                tablet={6}
                style={{ marginRight: 0, paddingRight: 0 }}
              >
                <Segment style={{ margin: 0, borderRadius: 0 }} inverted>
                  <Header>{character.description}</Header>
                  {Object.entries(character.details).map(([key, val]) => (
                    <Label key={key}>
                      {key}
                      <Label.Detail>{val}</Label.Detail>
                    </Label>
                  ))}
                  <p
                    style={{ marginTop: "1rem" }}
                    dangerouslySetInnerHTML={{
                      __html: `<p>${(character.background || "").replace(/\n/g, "</p><p>")}</p>`,
                    }}
                  />
                </Segment>
              </Grid.Column>
              <IsDesktop>
                <Grid.Column width={3} style={{ marginLeft: 0, paddingLeft: 0 }}>
                  <CharacterPortrait name={character.name} type="full" width={250} />
                </Grid.Column>
              </IsDesktop>
            </Grid>
          ),
        },
        {
          menuItem: "Skills",
          render: () => (
            <Grid centered>
              <Grid.Column width={IS_MOBILE ? 16 : 12}>
                <Table inverted collapsing style={{ borderRadius: 0 }} structured celled>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Ability</Table.HeaderCell>
                      <Table.HeaderCell>Slot</Table.HeaderCell>
                      <Table.HeaderCell>Type</Table.HeaderCell>
                      <Table.HeaderCell>Description</Table.HeaderCell>
                      <Table.HeaderCell>Details</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {character.abilities &&
                      Object.entries(character.abilities).map(([slot, ability]) => (
                        <Table.Row key={slot}>
                          <Table.Cell>
                            <Image src={getImageSrc(ability.name)} />
                            {ability.name}
                          </Table.Cell>
                          <Table.Cell>{slot}</Table.Cell>
                          <Table.Cell>{ability.type}</Table.Cell>
                          <Table.Cell>{ability.description}</Table.Cell>
                          <Table.Cell>
                            <Table basic="very" collapsing compact inverted>
                              {Object.entries(ability.stats).map(([statName, stat]) => (
                                <Table.Row key={statName}>
                                  <Table.Cell>{statName}</Table.Cell>
                                  <Table.Cell>{stat.value}</Table.Cell>
                                </Table.Row>
                              ))}
                            </Table>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                  </Table.Body>
                </Table>
              </Grid.Column>
            </Grid>
          ),
        },
        {
          menuItem: "Stats",
          render: () => (
            <Grid centered>
              <Grid.Column width={IS_MOBILE ? 16 : 8}>
                <CharacterStatTable character={character} />
              </Grid.Column>
            </Grid>
          ),
        },
        {
          menuItem: "Weapons",
          render: () => (
            <Grid centered>
              <Grid.Column width={12}>
                <IsDesktop>
                  <Table collapsing style={{ borderRadius: 0 }} structured celled striped inverted>
                    <Table.Header>
                      <Table.HeaderCell>Weapon Type</Table.HeaderCell>
                      <Table.HeaderCell>Difficulty</Table.HeaderCell>
                      <Table.HeaderCell>Information</Table.HeaderCell>
                      <Table.HeaderCell>Weapons</Table.HeaderCell>
                    </Table.Header>
                    <Table.Body>
                      {character.attributes.map((attr, id) => (
                        <Table.Row key={id}>
                          <Table.Cell textAlign="center">
                            <Link to={`/wiki/weapons/${ReverseWeaponsLookupKeyed[attr.mastery]}`}>
                              <Image
                                centered
                                bordered
                                size="small"
                                style={{
                                  maxHeight: "auto",
                                  width: "100px",
                                }}
                                src={getImageSrc(`/weaponSkills/${attr.mastery}`)}
                              />
                              {ReverseWeaponsLookupKeyed[attr.mastery]}
                            </Link>
                          </Table.Cell>
                          <Table.Cell>
                            <Rating
                              icon="star"
                              disabled
                              defaultRating={attr.controlDifficulty}
                              maxRating={3}
                            />
                          </Table.Cell>
                          <Table.Cell>
                            <AttributeChartComponent key={id} attributeBlock={attr} />
                          </Table.Cell>
                          <Table.Cell>
                            {getList(attr.mastery as any)
                              .sort((a, b) => a.rarityWeight - b.rarityWeight)
                              .map(({ id }) => (
                                <ItemModalButton key={id} id={id} />
                              ))}
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </IsDesktop>
                <IsMobile>
                  <Segment color="red" centered style={{ borderRadius: 0 }} inverted>
                    Not currently available for Mobile
                  </Segment>
                </IsMobile>
              </Grid.Column>
            </Grid>
          ),
        },
      ];

  return (
    <CharacterView>
      <Segment
        color="black"
        fluid
        inverted
        style={{
          margin: 0,
          marginTop: 12,
          padding: 0,
        }}
      >
        <Grid style={{ backgroundImage: BG_THIRD }} centered>
          <Grid.Column
            width={16}
            style={{
              backgroundColor: "rgba(76, 70, 70, 1)",
              backgroundImage: BG_THIRD,
              borderBottom: "1px groove",
              borderTop: "1px groove",
            }}
            centered
          >
            <Grid centered style={{ margin: 0, padding: 0 }}>
              <Grid.Column mobile={8} desktop={3} widescreen={3} tablet={4}>
                <CharacterPortrait type="mini" width={100} name={character.name} />
              </Grid.Column>
              <Grid.Column
                mobile={8}
                desktop={3}
                widescreen={2}
                tablet={4}
                textAlign="center"
                style={{ paddingLeft: 0 }}
                verticalAlign="middle"
              >
                <Statistic inverted size="tiny">
                  <Statistic.Value>{character.name}</Statistic.Value>
                  <Statistic.Label>
                    <span
                      style={{
                        fontStyle: "italic",
                        fontSize: "smaller",
                      }}
                    >
                      {character.description}
                    </span>
                  </Statistic.Label>
                </Statistic>
              </Grid.Column>
              {character.attributes.map((attr, id) => (
                <Grid.Column
                  mobile={3}
                  desktop={2}
                  widescreen={2}
                  tablet={3}
                  key={id}
                  verticalAlign="middle"
                >
                  <CharacterAttrStatistic attr={attr} />
                </Grid.Column>
              ))}
            </Grid>
          </Grid.Column>
          <Grid.Row
            style={{ backgroundColor: "rgba(150, 145, 138, 0.1)", paddingTop: 0, padding: 0 }}
            centered
          >
            <Grid.Column width={16} style={{ padding: 0 }}>
              <Tab
                menu={{
                  secondary: false,
                  inverted: true,
                  attached: true,
                  style: {
                    justifyContent: "center",
                    backgroundColor: "rgba(62, 58, 58, 1)",
                    padding: 0,
                  },
                }}
                style={{ borderRadius: 0 }}
                panes={panes}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </CharacterView>
  );
};

export const CharacterLandingPage = () => {
  const history = useHistory();

  return (
    <div style={{ marginTop: IS_MOBILE ? "2em" : "0" }}>
      <CharacterView>
        <IsDesktop>
          <Segment
            style={{
              backgroundColor: "rgba(150, 145, 138, 0.1)",
              marginTop: 0,
            }}
            textAlign="center"
          >
            <Table selectable striped collapsing style={{ margin: "auto" }} inverted>
              <Table.Header>
                <Table.HeaderCell />
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Weapons</Table.HeaderCell>
                <Table.HeaderCell>Q</Table.HeaderCell>
                <Table.HeaderCell>W</Table.HeaderCell>
                <Table.HeaderCell>E</Table.HeaderCell>
                <Table.HeaderCell>R</Table.HeaderCell>
                <Table.HeaderCell>Passive</Table.HeaderCell>
              </Table.Header>
              <Table.Body>
                {Object.entries(Character.SOURCES as Record<string, ICharacter>).map(
                  ([character, characterObject]) => (
                    <Table.Row
                      key={character}
                      onClick={() => history.push(`/wiki/characters/${character}`)}
                    >
                      <Table.Cell>
                        <CharacterThumbnailComponent width={60} name={character} isActive={false} />
                      </Table.Cell>
                      <Table.Cell>{character}</Table.Cell>
                      <Table.Cell>
                        {characterObject.attributes.map((attr, id) => (
                          <Image
                            key={attr.mastery}
                            inline
                            style={{
                              maxHeight: "auto",
                              width: "50px",
                            }}
                            src={getImageSrc(`Weapon${attr.mastery}`)}
                          />
                        ))}
                      </Table.Cell>
                      <Table.Cell>
                        <Image
                          bordered
                          size="mini"
                          src={getImageSrc(characterObject.abilities?.Q.name)}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <Image
                          bordered
                          size="mini"
                          src={getImageSrc(characterObject.abilities?.W.name)}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <Image
                          bordered
                          size="mini"
                          src={getImageSrc(characterObject.abilities?.E.name)}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <Image
                          bordered
                          size="mini"
                          src={getImageSrc(characterObject.abilities?.R.name)}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        {characterObject.abilities && (
                          <Image
                            bordered
                            size="mini"
                            src={getImageSrc(
                              Object.values(characterObject.abilities).find(
                                ({ type, slot }) =>
                                  type.includes("Passive") || slot.includes("Passive")
                              ).name
                            )}
                          />
                        )}
                      </Table.Cell>
                    </Table.Row>
                  )
                )}
              </Table.Body>
            </Table>
          </Segment>
        </IsDesktop>
      </CharacterView>
    </div>
  );
};
