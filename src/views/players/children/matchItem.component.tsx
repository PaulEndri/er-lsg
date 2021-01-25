import { Character, Item } from "erbs-sdk";
import React from "react";
import { Grid, Header, Image, Segment, Statistic, Table } from "semantic-ui-react";
import { CharacterPortrait } from "../../../components/characterPortrait.component";
import { ItemModalButton } from "../../../components/itemModalButton.component";
import { GameModes } from "erbs-client";
import { getImageSrc } from "../../../utilities/getImageSrc";
import { SkillMap } from "../../../utilities/skillMap";

const src = {
  matchingTeamMode: 3,
  characterNum: 17,
  characterLevel: 8,
  gameRank: 5,
  playerKill: 2,
  serverName: 0,
  playerAssistant: 0,
  monsterKill: 3,
  bestWeapon: 5,
  bestWeaponLevel: 7,
  versionMajor: 23,
  versionMinor: 1,
  maxHp: 1167,
  maxSp: 616,
  attackPower: 93,
  defense: 78,
  hpRegen: 1,
  spRegen: 1,
  attackSpeed: 1,
  moveSpeed: 3,
  outOfCombatMoveSpeed: 3,
  sightRange: 5,
  attackRange: 6,
  criticalChance: 0,
  criticalStrikeDamage: 0,
  coolDownReduction: 0,
  lifeSteal: 0,
  amplifierToMonster: 20,
  trapDamage: 4,
  gainExp: 16,
  startDtm: "2021-01-08T08:57:20.020+0900",
  duration: 261,
  mmrBefore: 733,
  damageToPlayer: 1642,
  damageToMonster: 1878,
  killerUserNum: 0,
  playTime: 263,
  watchTime: 0,
  totalTime: 263,
  botAdded: 0,
  seasonId: 0,
  botRemain: 0,
  restrictedAreaAccelerated: 0,
  safeAreas: 15,
  killer: 0,
  killDetail: "병원",
  causeOfDeath: "restrictedAreaExplosion",
  teamNumber: 4,
  preMade: 3,
  gainedNormalMmrKFactor: 11,
  skills: [],
  equipment: [
    { itemId: 110407 },
    { itemId: 202106 },
    { itemId: 201410 },
    { itemId: 203302 },
    { itemId: 204103 },
  ],
};

export const MatchInfoComponent = ({ data = src }) => {
  const character = new Character(data.characterNum);
  const eqp = data.equipment.map((id) => new Item(id));
  const wpn = eqp.find((i) => i.category === "Weapon");

  return (
    <Segment style={{ backgroundColor: "rgba(50, 50, 50, 1)" }}>
      <Grid>
        <Grid.Row verticalAlign="middle" stretched>
          <Grid.Column width={2} verticalAlign="middle">
            <CharacterPortrait name={character.name} type="mini" width={110} />
          </Grid.Column>
          <Grid.Column width={2} textAlign="left" style={{ color: "white" }}>
            {wpn && (
              <Image
                centered
                size="mini"
                src={getImageSrc(`Weapon${wpn.apiMetaData.type}`)}
                bordered
              />
            )}
            <Header
              inverted
              subheader={`${GameModes[data.matchingTeamMode]} - ${
                data.seasonId ? "Season " + data.seasonId : "Unranked"
              }`}
              content={`${data.gameRank}th Place`}
            />
            {new Date(data.startDtm).toDateString()}
            <br />
            {new Date(data.startDtm).toLocaleTimeString()}
          </Grid.Column>

          <Grid.Column width={8}>
            <Segment basic inverted style={{ background: "transparent", padding: 0, margin: 0 }}>
              <Statistic.Group inverted size="tiny">
                <Statistic>
                  <Statistic.Label>LP</Statistic.Label>
                  <Statistic.Value>{data.mmrBefore}</Statistic.Value>
                </Statistic>
                <Statistic>
                  <Statistic.Label>Kills</Statistic.Label>

                  <Statistic.Value>{data.playerKill}</Statistic.Value>
                </Statistic>
                <Statistic>
                  <Statistic.Label>Assists</Statistic.Label>
                  <Statistic.Value>{data.playerAssistant}</Statistic.Value>
                </Statistic>
                <Statistic>
                  <Statistic.Label>Level</Statistic.Label>
                  <Statistic.Value>{data.characterLevel}</Statistic.Value>
                </Statistic>

                <Statistic>
                  <Statistic.Label>Damage To Players</Statistic.Label>
                  <Statistic.Value>{data.damageToPlayer}</Statistic.Value>
                </Statistic>
              </Statistic.Group>
            </Segment>
            <Table
              celled
              structured
              compact
              inverted
              definition
              collapsing
              size="small"
              style={{
                backgroundColor: "rgba(100, 100, 100, 0.5)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell
                    style={{ backgroundColor: "transparent", border: 0, boxShadow: "none" }}
                  />
                  <Table.HeaderCell colSpan={11} style={{ textAlign: "center", padding: "2px" }}>
                    Skill Growth
                  </Table.HeaderCell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Level</Table.Cell>
                  <Table.HeaderCell>1</Table.HeaderCell>
                  <Table.HeaderCell>2</Table.HeaderCell>
                  <Table.HeaderCell>3</Table.HeaderCell>
                  <Table.HeaderCell>4</Table.HeaderCell>
                  <Table.HeaderCell>5</Table.HeaderCell>
                  <Table.HeaderCell>6</Table.HeaderCell>
                  <Table.HeaderCell>7</Table.HeaderCell>
                  <Table.HeaderCell>8</Table.HeaderCell>
                  <Table.HeaderCell>9</Table.HeaderCell>
                  <Table.HeaderCell>10</Table.HeaderCell>
                  <Table.HeaderCell>11</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Skill</Table.Cell>
                  {data.skills.slice(0, 11).map(({ skillId }, idx) => (
                    <Table.Cell key={idx}>{SkillMap[`${skillId}`]}</Table.Cell>
                  ))}
                </Table.Row>
              </Table.Body>
            </Table>
          </Grid.Column>
          <Grid.Column width={4} floated="right" verticalAlign="middle">
            <div
              style={{
                backgroundColor: "rgba(150, 150, 150, 0.5)",
                border: "3px groove rgba(255, 255, 255, 0.4)",
              }}
            >
              <Header
                inverted
                style={{ padding: 0, margin: 0, paddingTop: "8px", textAlign: "center" }}
              >
                Equipment
              </Header>
              <div
                style={{
                  display: "flex",
                  paddingLeft: 5,
                  paddingTop: 5,
                  flexFlow: "row wrap",
                  margin: "1em",
                  marginTop: "0",
                  backgroundColor: "rgba(30, 30, 30, 1)",
                  border: "2px outset rgba(255, 255, 255, 0.4)",
                }}
              >
                {data.equipment.map(({ itemId }, i) => (
                  <div key={i} style={{ padding: "0", margin: "0px", width: "33.33%" }}>
                    <div style={{ margin: 4 }}>
                      <ItemModalButton id={itemId} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};
