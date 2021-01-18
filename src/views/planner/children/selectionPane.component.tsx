import React, { useContext, useState } from "react";
import { Grid, Header, Segment, Button, Label, Menu, Checkbox } from "semantic-ui-react";
import { Character, Characters, Item, Items } from "erbs-sdk";
import { Types } from "../../../utilities/types";
import { getImageSrc } from "../../../utilities/getImageSrc";
import { ItemModalButton } from "../../../components/itemModalButton.component";
import CharacterThumbnailComponent from "../../../components/characterThumbnail.component";
import { getList } from "../../../utilities/getList";
import { DataContext } from "../../../state/data";
import { Link } from "react-router-dom";
import { ItemModalContext } from "../../../state/itemModal";
import { itemRarityBackground } from "../../../utilities/rarityColor";
import { LoadoutStats } from "./loadoutStats.component";
import { LoadoutPersistenceComponent } from "./loadoutPersistence.component";

export const SelectionPaneComponent: React.FC<any> = () => {
  const [quickAdd, toggleQuickAdd] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const { setItem } = useContext(ItemModalContext);
  const { character, updateCharacter, updateLoadout, loadout } = useContext(DataContext);

  const getTypeValue = (type) =>
    type === Types.Weapon && character && character.attributes
      ? character.attributes.map((attr) => getList(attr.mastery as any)).flat()
      : getList(type);

  const sectionItemAction = (item) =>
    !quickAdd ? setItem(item, true) : updateLoadout(item.clientType, item);

  const menuItemClick = (i) => () => setActiveIndex(i);
  return (
    <Grid centered>
      <Grid.Row stretched>
        <Grid.Column width={16} style={{ padding: 0, paddingLeft: "10px" }}>
          <Segment style={{ borderRadius: 0 }} inverted color="black" raised stacked padded>
            <p>
              <Header inverted>Equipment/Loadout Selection</Header>
              Select your desired character and equipment below than either generate a route
              automatically or proceed with
              <Link to="/planner/craft"> creating your own route.</Link> For automatic route
              generation, you can also choose your desired starting location if you have one.
            </p>
            <p>
              If you register and log in, you can save and share your loadouts freely and come back
              to them, complete with all generated route information
            </p>
          </Segment>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row style={{ paddingTop: 0, marginTop: 0 }}>
        <Grid.Column width={12}>
          <Menu tabular color="yellow" fluid inverted activeIndex={activeIndex}>
            <Menu.Item active={activeIndex === 0} onClick={menuItemClick(0)}>
              Character
            </Menu.Item>
            {Object.keys(Types).map((type: Types, i) => {
              return (
                <Menu.Item key={type} active={activeIndex === i + 1} onClick={menuItemClick(i + 1)}>
                  {type}
                </Menu.Item>
              );
            })}
            <Menu.Item position="right">
              <Label pointing="right" color="yellow" active basic>
                Quick Add?
              </Label>
              <Checkbox
                slider
                style={{ color: "white", marginLeft: "1em" }}
                checked={quickAdd}
                onChange={() => toggleQuickAdd(!quickAdd)}
              />
            </Menu.Item>
          </Menu>
        </Grid.Column>
        <Grid.Column width={4} style={{ padding: 0 }}>
          <Segment fluid basic inverted style={{ padding: 8, margin: 0 }}>
            <Header>Config & Info</Header>
          </Segment>
        </Grid.Column>
        <Grid.Column width={12}>
          <div
            style={{
              flexFlow: "row wrap",
              justifyContent: "center",
              backgroundColor: "rgba(70, 66, 66, 0.6)",
              paddingTop: "1rem",
              paddingBottom: "1rem",
              textAlign: "center",
              display: activeIndex === 0 ? "flex" : "none",
            }}
          >
            {Object.keys(Character.SOURCES).map((char) => (
              <div key={char} style={{ marginRight: "4px" }}>
                <CharacterThumbnailComponent
                  width={60}
                  name={char}
                  isActive={character && character.name === char}
                  onClick={() => updateCharacter(char as keyof typeof Characters)}
                />
              </div>
            ))}
          </div>
          {Object.keys(Types).map((type: Types, i) => {
            return (
              <div
                key={type}
                style={{
                  flexFlow: "row wrap",
                  justifyContent: "center",
                  backgroundColor: "rgba(70, 66, 66, 0.6)",
                  paddingTop: "1rem",
                  paddingBottom: "1rem",
                  textAlign: "center",
                  display: i + 1 === activeIndex ? "flex" : "none",
                }}
              >
                {getTypeValue(type)
                  .filter((item) => item)
                  .sort((a, b) => a.rarityWeight - b.rarityWeight)
                  .map((item, idx) => (
                    <ItemModalButton
                      id={item.id}
                      key={`${item.id}--${idx}`}
                      action={sectionItemAction}
                    />
                  ))}
              </div>
            );
          })}

          {loadout.materials && Object.entries(loadout.materials).length > 0 && (
            <>
              <Segment basic inverted style={{ padding: 8, margin: 0, marginTop: 8 }}>
                <Header>Total Materials Needed</Header>
              </Segment>
              <Segment
                raised
                inverted
                basic
                secondary
                style={{ margin: 0, backgroundColor: "rgba(70, 66, 66, 0.05)" }}
              >
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexWrap: "wrap",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  {Object.entries(loadout.materials)
                    .filter(([material]) => material && material !== "undefined")
                    .map(([material, quantity], key) => {
                      const item = new Item(Items[material]);

                      return (
                        <div key={key + material} style={{ margin: "5px" }}>
                          <Label
                            style={{
                              background: itemRarityBackground(item.rarity),
                              boxShadow: "1px 1px 4px 0px rgba(0, 0, 0, 0.5)",
                              "&:hover": {
                                boxShadow: "none",
                              },
                            }}
                            as={Button}
                            image
                            onClick={() => setItem(item)}
                          >
                            <img alt={material} src={getImageSrc(item.displayName)} />
                            <Label.Detail style={{ marginLeft: "-.5em" }}>{quantity}</Label.Detail>
                          </Label>
                        </div>
                      );
                    })}
                </div>
              </Segment>
            </>
          )}
        </Grid.Column>

        <Grid.Column width={4} style={{ padding: 0 }}>
          <LoadoutPersistenceComponent />
          <Segment.Group
            style={{
              border: 0,
              padding: 0,
            }}
          >
            {/* <Segment basic inverted style={{ padding: 8, margin: 0 }}>
              <Header>Desired Starting Location</Header>
            </Segment>
            <Segment raised>
              <Dropdown
                fluid
                placeholder="Automatic"
                value={startingLocation}
                onChange={(_e, { value }) => setStartingLocation(value)}
                options={[{ key: 999, value: null, text: "Automatic" }].concat(
                  Object.entries(Locations)
                    .filter(([x]) => isNaN(x as any))
                    .map(([name, value]: [string, number]) => ({
                      key: value,
                      text: name,
                      value: value,
                    }))
                )}
              />
            </Segment> */}

            <Segment basic inverted style={{ padding: 8, margin: 0 }}>
              <Header>Loadout Stats</Header>{" "}
            </Segment>
            <Segment raised color="black" inverted secondary>
              <LoadoutStats loadout={loadout} />
            </Segment>
          </Segment.Group>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default SelectionPaneComponent;
