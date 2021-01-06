import { Item, WeaponsLookup, WeaponType } from "erbs-sdk";
import React, { useState } from "react";
import {
  Button,
  Image,
  Segment,
  Container,
  Grid,
  Menu,
  Header,
  Statistic,
  TransitionGroup,
} from "semantic-ui-react";
import { Link, useHistory, useParams } from "react-router-dom";
import { getImageSrc } from "../../../utilities/getImageSrc";
import CharacterThumbnailComponent from "../../../components/characterThumbnail.component";
import { ItemModalButton } from "../../../components/itemModalButton.component";
import { ItemCardComponent } from "../../../components/itemCard.component";
import { getItemList } from "../../../utilities/getList";
import { Types } from "../../../utilities/types";
import { ItemSearchComponent } from "./ItemSearch.component";
import { BG_HALF, BG_THIRD } from "../../../utilities/bgImages";

export const WeaponPage = () => {
  const history = useHistory();
  const { id } = useParams() as any;
  const weaponType = id ? new WeaponType(id) : null;

  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <Container fluid>
      <Menu
        className="attached"
        color="red"
        inverted
        style={{
          borderRadius: 0,
          marginBottom: 0,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {Object.keys(WeaponsLookup)
          .filter((wpn) => wpn !== "Whip")
          .map((wpn) => (
            <Menu.Item
              key={wpn}
              active={id === wpn}
              onClick={() => {
                history.push(`/wiki/weapons/${wpn}`);
              }}
              color="red"
              style={{
                borderRadius: 0,
              }}
            >
              <Image size="mini" src={getImageSrc(`Weapon${WeaponsLookup[wpn]}`)} />
            </Menu.Item>
          ))}
      </Menu>

      {id && (
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
          <Grid centered>
            <Grid.Row
              verticalAlign="middle"
              style={{
                backgroundColor: "rgba(76, 70, 70, 1)",
                backgroundImage: BG_THIRD,
                borderBottom: "1px groove",
                borderTop: "1px groove",
              }}
              centered
            >
              <Grid.Column width={2} textAlign="center">
                <Image centered bordered src={getImageSrc(`/weaponSkills/${WeaponsLookup[id]}`)} />
              </Grid.Column>
              <Grid.Column width={2} textAlign="center">
                <Header inverted textAlign="center">
                  {id}
                </Header>
              </Grid.Column>
              <Grid.Column width={Math.min(weaponType.usableBy.length + 2, 8) as any}>
                <div style={{ display: "flex", flexFlow: "row wrap" }}>
                  {weaponType.usableBy.map((char) => (
                    <div key={char}>
                      <CharacterThumbnailComponent
                        onClick={() => history.push(`/wiki/characters/${char}`)}
                        isActive={false}
                        name={char}
                      />
                    </div>
                  ))}
                </div>
              </Grid.Column>
            </Grid.Row>
            {weaponType.abilityDetails && weaponType.abilityDetails.name && (
              <Grid.Row
                verticalAlign="middle"
                style={{
                  backgroundColor: "rgba(38, 35, 35, 0.5)",
                  borderBottom: "1px groove",
                  borderTop: "1px groove",
                }}
                centered
              >
                <Grid.Column width={16} textAlign="center">
                  <Header inverted as="h1">
                    {weaponType.abilityDetails.name.replace(/_/g, " ")}
                  </Header>
                </Grid.Column>
                <Grid.Column width={16} textAlign="center">
                  {weaponType.abilityDetails.description}
                </Grid.Column>
                <Grid.Column width={12} textAlign="center" style={{ paddingTop: "2rem" }}>
                  <Statistic.Group
                    size={"mini"}
                    widths="three"
                    color="red"
                    inverted
                    items={weaponType.abilityDetails.info.map(({ title, value }) => ({
                      key: title,
                      value,
                      label: title,
                    }))}
                  />
                </Grid.Column>
              </Grid.Row>
            )}
            <Grid.Row
              style={{
                backgroundColor: "rgba(255, 250, 250, 0.9)",
                paddingTop: 0,
                backgroundImage: BG_HALF,
              }}
              centered
            >
              <Grid.Column width={16}>
                <Segment style={{ borderRadius: 0 }} textAlign="center" secondary raised>
                  <Header color="orange">Weapon Options</Header>
                </Segment>
              </Grid.Column>
              {selectedItem && (
                <Grid.Column width={4} style={{ marginRight: 0, paddingRight: 0 }}>
                  <ItemCardComponent item={new Item(selectedItem)} />
                </Grid.Column>
              )}
              <Grid.Column
                width={selectedItem ? 6 : 12}
                style={{
                  paddingTop: 10,
                  backgroundColor: "rgba(36, 30, 30, 0.1)",
                  marginLeft: 0,
                }}
                textAlign="center"
              >
                {weaponType.items.map(({ id }) => (
                  <ItemModalButton key={id} id={id} action={(id) => setSelectedItem(id)} />
                ))}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      )}

      {!id && (
        <ItemSearchComponent
          setSelectedItem={(id, item) => {
            history.push(`/wiki/weapons/${item.clientType}`);
            setSelectedItem(id);
          }}
          items={getItemList(Types.Weapon)}
          title="Weapon Options"
          path="/wiki/weapons"
        />
      )}
    </Container>
  );
};
