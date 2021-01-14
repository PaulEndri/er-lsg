import React from "react";
import { Segment, Grid, Dropdown } from "semantic-ui-react";
import { RouteCraftingColumnComponent } from "./routeCraftingColumn.component";

export const MobileCraftingContentComponent = ({
  activeRoute,
  getOptions,
  optionChangeHandler,
  setItem,
}) => (
  <>
    {activeRoute.map((route, index) => (
      <Grid.Row key={index}>
        <Grid.Column width={14}>
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
        {!route ||
          (!route.location && (
            <Grid.Column width={14} key={index}>
              <Segment raised placeholder textAlign={"center"} color="black" inverted secondary>
                Select a location above
              </Segment>
            </Grid.Column>
          ))}
        {route && route.location && (
          <RouteCraftingColumnComponent
            key={index}
            location={route.location}
            completed={route.completed}
            craftable={route.craftableItems}
            setItem={setItem}
          />
        )}
      </Grid.Row>
    ))}
  </>
);
