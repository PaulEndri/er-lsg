import React, { useContext } from "react";
import { Segment, Grid, Dropdown, Header } from "semantic-ui-react";
import { Location, Locations } from "erbs-sdk";
import { ItemModalContext } from "../../../state/itemModal";
import { DataContext } from "../../../state/data";
import { RouteCraftingColumnComponent } from "./routeCraftingColumn.component";

const LoadedLocations: Record<number, Location> = Object.fromEntries(
  Object.values(Locations).map((loc) => {
    const location = new Location(loc);

    return [location.id, location];
  })
);

const AllEntries = Object.entries(LoadedLocations).map(([id, loc]) => ({
  value: id,
  text: loc.name,
}));
export const RouteCraftingPaneComponent: React.FC = () => {
  const { activeRoute, updateActiveRoute } = useContext(DataContext);
  const { setItem } = useContext(ItemModalContext);

  const values = activeRoute.map(({ location }) => (location ? +location.id : null));

  const getConnections = (loc, index) =>
    loc.connections
      .filter((con) => !values.slice(0, index).includes(con.id))
      .map((con) => ({
        name: con.name,
        text: con.name,
        value: +con.id,
      }));

  const optionChangeHandler = (index) => (e, { value }) => {
    const location = LoadedLocations[+value];
    const currentValue = values[index];

    if (+currentValue === +value) {
      return;
    }

    values[index] = +value;

    updateActiveRoute(index, location);
  };

  const getOptions = (index) => {
    if (index === 0) {
      return AllEntries;
    }
    if (values[index - 1]) {
      const loc = LoadedLocations[values[index - 1]];

      if (loc.teleport) {
        return AllEntries.filter((x) => !values.includes(+x.value));
      } else {
        return getConnections(loc, index);
      }
    }
    return [];
  };

  return (
    <Grid centered style={{ marginTop: 0, backgroundColor: "rgba(79, 76, 76, 0.2)" }}>
      <Grid.Row stretched>
        <Grid.Column width={15}>
          <Segment style={{ borderRadius: 0 }} inverted color="black" raised stacked padded>
            <p>
              <Header inverted>Route Crafter</Header>
              Below you will find a personalized route crafter. Starting with the left most option,
              select your desired starting location and from there you will be able to only select
              connecting areas next. With area you will see all items that are craftable in that
              location, and if you have added an item to your loadout you will be notified if an
              item in your loadout completes in that zone.
            </p>
          </Segment>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row style={{ marginBottom: 0, paddingBottom: 0, marginTop: 0, paddingTop: 0 }}>
        {activeRoute.map((route, index) => (
          <Grid.Column width={3} key={index}>
            <Segment style={{ padding: "1rem", borderRadius: 0 }}>
              <Dropdown
                fluid
                search={true}
                header="Select a Location"
                placeholder="Select a Location"
                value={route.location ? route.location.id.toString() : null}
                options={[{ value: null, text: "None" } as any].concat(getOptions(index))}
                onChange={optionChangeHandler(index)}
              />
            </Segment>
          </Grid.Column>
        ))}
      </Grid.Row>
      <Grid.Row style={{ marginTop: 0, paddingTop: 0 }}>
        {activeRoute.map((selectedRoute, index) => {
          if (!selectedRoute || !selectedRoute.location) {
            return (
              <Grid.Column width={3} key={index}>
                <Segment raised placeholder textAlign={"center"} color="black" inverted secondary>
                  Select a location above
                </Segment>
              </Grid.Column>
            );
          }
          const { location, completed, craftableItems } = selectedRoute;
          return (
            <RouteCraftingColumnComponent
              key={index}
              location={location}
              completed={completed}
              craftable={craftableItems}
              setItem={setItem}
            />
          );
        })}
      </Grid.Row>
    </Grid>
  );
};

export default RouteCraftingPaneComponent;
