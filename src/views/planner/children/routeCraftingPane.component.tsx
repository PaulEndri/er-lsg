import React, { useContext } from "react";
import { Segment, Grid, Header } from "semantic-ui-react";
import { Location, Locations } from "erbs-sdk";
import { ItemModalContext } from "../../../state/itemModal";
import { DataContext } from "../../../state/data";
import IsDesktop from "../../../components/isDesktop";
import { DesktopCraftingContentComponent } from "./desktopCraftingContent.component";
import IsMobile from "../../../components/isMobile";
import { MobileCraftingContentComponent } from "./mobileCraftingContent.component";

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
    <Grid centered style={{ marginTop: 0 }}>
      <Grid.Row stretched>
        <Grid.Column width={15}>
          <Segment style={{ borderRadius: 0 }} inverted={true} color="black" raised stacked padded>
            <p>
              <Header inverted={true}>Route Crafter</Header>
              Below you will find a personalized route crafter. Starting with the left most option,
              select your desired starting location and from there you will be able to only select
              connecting areas next. With area you will see all items that are craftable in that
              location, and if you have added an item to your loadout you will be notified if an
              item in your loadout completes in that zone.
            </p>
          </Segment>
        </Grid.Column>
      </Grid.Row>
      <IsDesktop>
        <DesktopCraftingContentComponent
          setItem={setItem}
          optionChangeHandler={optionChangeHandler}
          activeRoute={activeRoute}
          getOptions={getOptions}
        />
      </IsDesktop>
      <IsMobile>
        <MobileCraftingContentComponent
          setItem={setItem}
          optionChangeHandler={optionChangeHandler}
          activeRoute={activeRoute}
          getOptions={getOptions}
        />
      </IsMobile>
    </Grid>
  );
};

export default RouteCraftingPaneComponent;
