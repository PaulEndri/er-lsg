import React, { useContext } from "react";
import { Segment, Grid, Dropdown } from "semantic-ui-react";
import { Location, Locations } from "erbs-sdk";
import { ItemModalContext } from "../../../state/itemModal";
import { LoadoutContext } from "../../../state/loadout";
import { RouteCraftingColumnComponent } from "./routeCraftingColumn.component";

const LoadedLocations: Record<number, Location> = Object.fromEntries(
  Object.values(Locations).map((loc) => {
    const location = new Location(loc);

    return [location.id, location];
  })
);

export const RouteCraftingComponent: React.FC = () => {
  const { activeRoute, updateActiveRoute } = useContext(LoadoutContext);
  const { setItem } = useContext(ItemModalContext);

  const values = new Array(5).fill(null);

  activeRoute.forEach(({ location }, index) => {
    values[index] = location.id;
  });

  const getOptions = (index) => {
    const allEntries = Object.entries(LoadedLocations).map(([id, loc]) => ({
      value: id,
      name: loc.name,
      text: loc.name,
    }));

    if (index === 0) {
      return allEntries;
    }
    if (values[index - 1]) {
      const loc = LoadedLocations[values[index - 1]];

      if (loc.teleport) {
        return allEntries.filter((x) => !values.slice(0, index).includes(x.value));
      } else {
        return loc.connections
          .filter((con) => !values.slice(0, index).includes(con.id))
          .map((con) => ({
            name: con.name,
            text: con.name,
            value: con.id,
          }));
      }
    }
    return allEntries;
  };

  return (
    <Grid centered>
      <Grid.Row style={{ marginBottom: 0, paddingBottom: 0 }}>
        {values.map((id, index) => (
          <Grid.Column width={3} key={index}>
            <Segment style={{ padding: "1rem", borderRadius: 0 }}>
              <Dropdown
                key={index}
                fluid
                placeholder="Select a Location"
                value={id}
                options={getOptions(index)}
                onChange={(e, { value }) => {
                  updateActiveRoute(index, LoadedLocations[+value]);
                }}
              />
            </Segment>
          </Grid.Column>
        ))}
      </Grid.Row>
      <Grid.Row style={{ marginTop: 0, paddingTop: 0 }}>
        {values.map((id, index) => {
          const selectedRoute = activeRoute[index];

          if (!selectedRoute) {
            return (
              <Grid.Column width={3} key={index}>
                <Segment placeholder color="black" inverted secondary>
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
