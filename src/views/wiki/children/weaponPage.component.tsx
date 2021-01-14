import { Item, Weapons, WeaponType } from "erbs-sdk";
import React, { useState } from "react";
import { Image, Segment, Container, Grid, Menu, Header, Statistic } from "semantic-ui-react";
import { useHistory, useParams } from "react-router-dom";
import { getImageSrc } from "../../../utilities/getImageSrc";
import CharacterThumbnailComponent from "../../../components/characterThumbnail.component";
import { ItemModalButton } from "../../../components/itemModalButton.component";
import { ItemCardComponent } from "../../../components/itemCard.component";
import { Types } from "../../../utilities/types";
import { ItemSearchComponent } from "./ItemSearch.component";
import { BG_THIRD } from "../../../utilities/bgImages";
import { getList } from "../../../utilities/getList";

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
        secondary
        inverted
        style={{
          borderRadius: 0,
          marginBottom: 0,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {Object.entries(Weapons).map(([key, name]) => (
          <Menu.Item
            key={name}
            active={id === key}
            onClick={() => {
              history.push(`/wiki/weapons/${key}`);
            }}
            color="red"
            style={{
              borderRadius: 0,
            }}
          >
            <div
              style={{
                backgroundColor: "rgba(51, 49, 49, 0.9)",
                borderRadius: "5px",
                boxShadow: "2px 2px 2px rgba(31, 29, 29, 0.3)",
              }}
            >
              <Image size="mini" src={getImageSrc(`Weapon${name}`)} />
            </div>
          </Menu.Item>
        ))}
      </Menu>

      {id && (
        <Segment
          inverted
          style={{
            margin: 0,
            marginTop: 12,
            padding: 0,
            borderRadius: 0,
          }}
        >
          <Grid centered>
            <Grid.Row style={{ backgroundImage: BG_THIRD }}>
              <Grid.Column width={16}>
                <Grid centered>
                  <Grid.Row
                    verticalAlign="middle"
                    style={{
                      backgroundColor: "rgba(145, 140, 140, 0.3)",
                      borderBottom: "1px groove",
                    }}
                    centered
                  >
                    <Grid.Column
                      mobile={6}
                      desktop={3}
                      widescreen={2}
                      tablet={4}
                      textAlign="center"
                    >
                      <Image centered bordered src={getImageSrc(`/weaponSkills/${Weapons[id]}`)} />
                    </Grid.Column>
                    <Grid.Column
                      mobile={6}
                      desktop={2}
                      widescreen={1}
                      tablet={3}
                      textAlign="center"
                    >
                      <Header inverted textAlign="center">
                        {weaponType.name}
                      </Header>
                    </Grid.Column>
                    <Grid.Column
                      mobile={16}
                      tablet={8}
                      widescreen={Math.min(weaponType.usableBy.length + 2, 8) as any}
                      desktop={Math.min(weaponType.usableBy.length + 3, 8) as any}
                    >
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
                </Grid>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row
              style={{
                paddingTop: 0,
                backgroundColor: "rgba(32, 29, 29, 0.2)",
                background: BG_THIRD,
              }}
              centered
            >
              <Grid.Column width={16}>
                <Segment style={{ borderRadius: 0 }} textAlign="center" secondary raised inverted>
                  <Header inverted>Weapon Options</Header>
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
                {weaponType.items
                  .map(({ id }) => {
                    try {
                      return new Item(id);
                    } catch (e) {
                      console.warn(e);
                    }
                    return null;
                  })
                  .filter((x) => x)
                  .sort((a: Item, b: Item) => a.rarityWeight - b.rarityWeight)
                  .map(({ id }) => (
                    <ItemModalButton key={id} id={id} action={() => setSelectedItem(id)} />
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
          items={getList(Types.Weapon)}
          title="Weapon Options"
          path="/wiki/weapons"
        />
      )}
    </Container>
  );
};
