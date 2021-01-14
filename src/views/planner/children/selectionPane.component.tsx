import React, { useContext, useState } from "react";
import { Grid, Header, Segment, Button, Label, Dropdown } from "semantic-ui-react";
import { Character, Characters, Item, Items, Locations, Route } from "erbs-sdk";
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

export const SelectionPaneComponent: React.FC<any> = ({ full = true }) => {
  const [startingLocation, setStartingLocation] = useState(null);
  const { toggle, filterStates } = useContext(FilterContext);

  const { setItem } = useContext(ItemModalContext);
  const { character, updateCharacter, setRoutes, loadout } = useContext(DataContext);

  const getTypeValue = (type) =>
    type === Types.Weapon && character && character.attributes
      ? character.attributes.map((attr) => getList(attr.mastery as any)).flat()
      : getList(type);

  const mobileWidth = 14;
  const desktopWidth = 9;

  const generateRoute = () => {
    try {
      const route = new Route(loadout);

      const routes = route.generate(startingLocation);

      setRoutes(routes);
    } catch (e) {
      console.error(e);
      setRoutes([]);
    }
  };
  return (
    <Grid
      centered
      style={{ height: "max-content", marginTop: 0, backgroundColor: "rgba(54, 50, 52, 0.5)" }}
    >
      {full && (
        <Grid.Row stretched>
          <Grid.Column width={IS_MOBILE ? mobileWidth : desktopWidth}>
            <Segment style={{ borderRadius: 0 }} inverted color="black" raised stacked padded>
              <p>
                <Header inverted>Equipment/Loadout Selection</Header>
                Select your desired character and equipment below to either aid in{" "}
                <Link to="/planner/craft">creating your own routes</Link> or{" "}
                <Link to="/planner/route">automatically generating routes</Link>
              </p>
              <p>
                <Header inverted>Route Generator</Header>
                Here you can select starting location (optional) and automatically generate routes.
                Route optimization is based on connectivity, item availability vs items needed, and
                more.
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
                      <ItemModalButton id={item.id} key={`${item.id}--${idx}`} />
                    ))}
                </SectionComponent>
              </Grid.Column>
            );
          })}
        </Grid.Column>
        <Grid.Column width={IS_MOBILE ? mobileWidth : 4} style={{ padding: 0 }}>
          <Segment.Group
            style={{
              borderRadius: 0,
              border: 0,
              padding: 0,
            }}
          >
            <Segment textAlign="center" basic inverted style={{ padding: 8, margin: 0 }}>
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

            <Segment textAlign="center" basic inverted style={{ padding: 8, margin: 0 }}>
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
            <Segment
              style={{
                border: 0,
                borderRadius: 0,
                background: "transparent",
                padding: 0,
              }}
              inverted
              raised
            >
              <Button
                style={{ borderRadius: 0 }}
                fluid
                onClick={generateRoute}
                content="Generate Routes"
                color="green"
              />
            </Segment>
          </Segment.Group>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default SelectionPaneComponent;
