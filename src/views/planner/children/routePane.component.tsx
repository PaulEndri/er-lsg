import React, { useContext, useState } from "react";
import { Segment, Grid, Header, Button, Label, Dropdown } from "semantic-ui-react";
import { getImageSrc } from "../../../utilities/getImageSrc";
import { Item, Items, Locations, Route } from "erbs-sdk";
import { ItemModalContext } from "../../../state/itemModal";
import { DataContext } from "../../../state/data";
import { RouteListComponent } from "./routeList.component";
import { itemRarityBackground } from "../../../utilities/rarityColor";

export const RoutePaneComponent: React.FC = () => {
  const [startingLocation, setStartingLocation] = useState(null);
  const { routes, setRoutes, loadout, setRoute } = useContext(DataContext);
  const { setItem } = useContext(ItemModalContext);

  const generateRoute = () => {
    try {
      const route = new Route(loadout);

      const routes = route.generate(+Locations[startingLocation]);

      setRoutes(routes);
    } catch (e) {
      console.error(e);
      setRoutes([]);
    }
  };

  return (
    <Grid centered style={{ height: "max-content", marginTop: 0 }}>
      <Grid.Row stretched>
        <Grid.Column width={13}>
          <Segment style={{ borderRadius: 0 }} inverted color="black" raised stacked padded>
            <p>
              <Header inverted>Route Generator</Header>
              Here you can select starting location (optional) and automatically generate routes.
              Route optimization is based on connectivity, item availability vs items needed, and
              more.
            </p>
          </Segment>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row style={{ paddingTop: 0, marginTop: 0 }}>
        <Grid.Column mobile={10} tablet={5} computer={4} widescreen={3}>
          <Segment.Group
            style={{
              borderRadius: 0,
              border: 0,
              backgroundColor: "rgba(74, 64, 62, 0.6)",
              marginTop: 14,
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
            <Segment raised style={{ background: "transparent" }}>
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
                            padding: 0,
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
        <Grid.Column width={10}>
          <Grid.Row centered>
            <Grid.Column width={16} textAlign="center">
              <Segment.Group
                style={{
                  borderRadius: 0,
                  backgroundColor: "rgba(74, 64, 62, 0.5)",
                  marginTop: 14,

                  border: 0,
                }}
              >
                <Segment
                  style={{
                    border: 0,
                    borderRadius: 0,
                  }}
                  color="black"
                  inverted
                  raised
                >
                  <Button fluid onClick={generateRoute} content="Generate Routes" color="green" />
                </Segment>
                <Segment raised basic compact style={{}}>
                  {!routes && (
                    <Segment secondary inverted placeholder textAlign="center">
                      No Routes Generated
                    </Segment>
                  )}
                  {routes && (
                    <div>
                      <RouteListComponent
                        setRoute={setRoute}
                        root={routes.root}
                        routes={routes.routes}
                      />
                    </div>
                  )}
                </Segment>
              </Segment.Group>
            </Grid.Column>
          </Grid.Row>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default RoutePaneComponent;
