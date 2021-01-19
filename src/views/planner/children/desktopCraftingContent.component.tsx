import React from "react";
import { Segment, Grid, Dropdown } from "semantic-ui-react";
import { RouteCraftingColumnComponent } from "./routeCraftingColumn.component";
import { IS_MOBILE } from "../../../components/isMobile";

export const DesktopCraftingContentComponent = ({
  activeRoute,
  getOptions,
  optionChangeHandler,
  setItem,
}) => (
  <>
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
            <Grid.Column width={IS_MOBILE ? 12 : 3} key={index}>
              <Segment
                raised
                placeholder
                textAlign={"center"}
                color="black"
                inverted={true}
                secondary
              >
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
  </>
);
