import React, { useContext, useState } from "react";
import { Grid, Header, Segment, Button, Label, Dropdown, Form, Radio } from "semantic-ui-react";
import { Character, Characters, Item, Items, Locations } from "erbs-sdk";
import { Types } from "../../../utilities/types";
import { getImageSrc } from "../../../utilities/getImageSrc";
import { ItemModalButton } from "../../../components/itemModalButton.component";
import { SectionComponent } from "../../../components/section.component";
import CharacterThumbnailComponent from "../../../components/characterThumbnail.component";
import { getList } from "../../../utilities/getList";
import { DataContext } from "../../../state/data";
import { FilterContext } from "../state";
import { Link } from "react-router-dom";
import { IS_MOBILE } from "../../../components/isMobile";
import { ItemModalContext } from "../../../state/itemModal";
import { itemRarityBackground } from "../../../utilities/rarityColor";
import { LoadoutStats } from "./loadoutStats.component";
import { LoadoutPersistenceComponent } from "./loadoutPersistence.component";

export const SelectionPaneComponent: React.FC<any> = ({ generateRoute, full = true }) => {
  const [startingLocation, setStartingLocation] = useState(null);
  const [quickAdd, toggleQuickAdd] = useState(false);
  const { toggle, filterStates } = useContext(FilterContext);
  const { setItem } = useContext(ItemModalContext);
  const { character, updateCharacter, updateLoadout, loadout } = useContext(DataContext);

  const getTypeValue = (type) =>
    type === Types.Weapon && character && character.attributes
      ? character.attributes.map((attr) => getList(attr.mastery as any)).flat()
      : getList(type);

  const mobileWidth = 14;
  const desktopWidth = 9;
  const sectionItemAction = (item) =>
    !quickAdd ? setItem(item, true) : updateLoadout(item.clientType, item);
  return (
    <Grid
      centered
      style={{ height: "max-content", marginTop: 0, backgroundColor: "rgba(54, 50, 52, 0.5)" }}
    >
      {full && (
        <Grid.Row stretched>
          <Grid.Column width={14}>
            <Segment style={{ borderRadius: 0 }} inverted color="black" raised stacked padded>
              <p>
                <Header inverted>Equipment/Loadout Selection</Header>
                Select your desired character and equipment below than either generate a route
                automatically or proceed with
                <Link to="/planner/craft"> creating your own route.</Link> For automatic route
                generation, you can also choose your desired starting location if you have one.
              </p>
              <p>
                If you register and log in, you can save and share your loadouts freely and come
                back to them, complete with all generated route information
              </p>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      )}
      <Grid.Row style={{ paddingTop: 0, marginTop: 0 }}>
        <Grid.Column width={IS_MOBILE ? mobileWidth : desktopWidth}>
          <Grid.Column style={{ padding: 0 }} width={IS_MOBILE ? mobileWidth : desktopWidth}>
            <SectionComponent title="Test Subject Selection">
              <div
                style={{
                  display: "flex",
                  flexFlow: "row wrap",
                  justifyContent: "center",
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
            </SectionComponent>
          </Grid.Column>
          {Object.keys(Types).map((type: Types) => {
            return (
              <Grid.Column
                style={{ padding: 0 }}
                width={IS_MOBILE ? mobileWidth : desktopWidth}
                key={type}
              >
                <SectionComponent
                  title={`${type} Selection`}
                  collapsed={filterStates[type]}
                  toggleCollapse={toggle[type]}
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
                </SectionComponent>
              </Grid.Column>
            );
          })}
        </Grid.Column>
        <Grid.Column width={IS_MOBILE ? mobileWidth : 4} style={{ padding: 0 }}>
          <LoadoutPersistenceComponent />
          <Segment.Group
            style={{
              borderRadius: 0,
              border: 0,
              padding: 0,
            }}
          >
            <Segment basic inverted style={{ padding: 8, margin: 0 }}>
              <Header>Options</Header>
            </Segment>
            <Segment
              style={{
                border: 0,
                borderRadius: 0,
              }}
              color="black"
              inverted
              secondary
              raised
            >
              <div
                style={{
                  padding: "1em",
                }}
              >
                <Form inverted>
                  <Form.Field>
                    <Radio
                      style={{ color: "white" }}
                      label="Automatically add items to loadout on click"
                      checked={quickAdd}
                      slider
                      onChange={() => toggleQuickAdd(!quickAdd)}
                    />
                  </Form.Field>
                </Form>
              </div>
              <Button
                fluid
                style={{ borderRadius: 0 }}
                onClick={generateRoute}
                content="Generate Routes"
                color="green"
              />
              <Button
                fluid
                style={{ borderRadius: 0 }}
                onClick={() => updateLoadout(null, null)}
                content="Clear Loadout"
                color="red"
              />
            </Segment>
            <Segment basic inverted style={{ padding: 8, margin: 0 }}>
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
            </Segment>

            <Segment basic inverted style={{ padding: 8, margin: 0 }}>
              <Header>Loadout Stats</Header>{" "}
            </Segment>
            <Segment raised color="black" inverted secondary>
              <LoadoutStats loadout={loadout} />
            </Segment>
            <Segment basic inverted style={{ padding: 8, margin: 0 }}>
              <Header>Total Materials Needed</Header>
            </Segment>
            <Segment raised color="black" inverted secondary>
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
          </Segment.Group>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default SelectionPaneComponent;
