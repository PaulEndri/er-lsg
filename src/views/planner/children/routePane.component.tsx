import React, { useContext, useState } from "react";
import { Segment, Grid, Header, Button, Label, Form, Dropdown } from "semantic-ui-react";
import { getImageSrc } from "../../../utilities/getImageSrc";
import { Item, Items, Locations, Route } from "erbs-sdk";
import { ItemModalContext } from "../../../state/itemModal";
import { LoadoutContext } from "../../../state/loadout";
import { RouteListComponent } from "./routeList.component";

const defaultWeights = {
  Weapon: 1,
  Chest: 1,
  Head: 1,
  Arm: 1,
  Leg: 1,
  Accessory: 1,
};

export const RoutePaneComponent: React.FC = () => {
  const [weights, updateWeights] = useState(defaultWeights);
  const [startingLocation, setStartingLocation] = useState(null);
  const { routes, setRoutes, loadout, setRoute } = useContext(LoadoutContext);
  const { setItem } = useContext(ItemModalContext);

  const generateRoute = () => {
    try {
      const route = new Route(loadout, weights);

      const routes = route.generate(+Locations[startingLocation]);

      setRoutes(routes);
    } catch (e) {
      console.error(e);
      setRoutes([]);
    }
  };

  return (
    <Grid centered>
      <Grid.Row>
        <Grid.Column mobile={10} tablet={5} computer={4} widescreen={3}>
          <Segment.Group
            style={{
              borderRadius: 0,
              backgroundColor: "rgba(74, 64, 62, 0.6)",
              marginTop: 14,
            }}
          >
            <Segment
              style={{
                border: 0,
                borderRadius: 0,
              }}
              raised
              inverted
              color="black"
              textAlign="center"
            >
              <Header>Customization</Header>
            </Segment>
            <Segment basic inverted style={{ margin: 0, background: "transparent" }}>
              <Header style={{ textAlign: "center" }}>Equipment Importance</Header>
              <Form
                inverted
                style={{
                  display: "flex",
                  flexFlow: "wrap column",
                  padding: "10px",
                }}
              >
                {Object.keys(defaultWeights).map((weight, idx) => (
                  <Form.Field key={weight + idx}>
                    <label style={{ textTransform: "capitalize" }}>
                      {loadout &&
                      loadout[weight.toLowerCase()] &&
                      loadout[weight.toLowerCase()].name
                        ? loadout[weight.toLowerCase()].name
                        : weight}
                    </label>
                    <input
                      type="range"
                      step={1}
                      style={
                        {
                          background: `linear-gradient(to right, #2185d0 0%, #2185d0 ${weights[weight]}%, #fff ${weights[weight]}%, #fff 100%)`,
                          borderRadius: "8px",
                          height: "5px",
                          width: "100%",
                          outline: "none",
                          transition: "background 450ms ease-in",
                          WebkitAppearance: "none",
                          "&::webkitSliderThumb": {
                            WebkitApperance: "none",
                            backgroundColor: "red",
                          },
                        } as any
                      }
                      min={1}
                      max={100}
                      value={weights[weight]}
                      onChange={(e) =>
                        updateWeights({
                          ...weights,
                          [weight]: e.target.value,
                        })
                      }
                    />
                  </Form.Field>
                ))}
              </Form>
            </Segment>
            <Segment textAlign="center" basic inverted style={{ padding: 8, margin: 0 }}>
              <Header>Desired Starting Location</Header>
            </Segment>
            <Segment>
              <Dropdown
                fluid
                placeholder="Automatic"
                value={startingLocation}
                onChange={(e, { value }) => setStartingLocation(value)}
                options={[{ key: 999, value: null, text: "Automatic" }].concat(
                  Object.entries(Locations).map(([name, value]: [string, number]) => ({
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
            <Segment style={{ background: "transparent" }}>
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
                  .map(([material, quantity], key) => (
                    <div key={key + material} style={{ margin: "5px" }}>
                      <Label
                        color="teal"
                        as={Button}
                        image
                        onClick={() => setItem(new Item(Items[material]))}
                      >
                        <img src={getImageSrc(Items[material].replace(/([A-Z])/g, " $1").trim())} />
                        <Label.Detail style={{ marginLeft: "-.5em" }}>{quantity}</Label.Detail>
                      </Label>
                    </div>
                  ))}
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
                <Segment basic compact style={{ width: "fit-content" }}>
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
