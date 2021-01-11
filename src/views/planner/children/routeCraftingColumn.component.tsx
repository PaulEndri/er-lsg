import React from "react";
import { Grid, Header, Button, Label, Image, Segment } from "semantic-ui-react";
import { getImageSrc } from "../../../utilities/getImageSrc";
import { ItemModalButton } from "../../../components/itemModalButton.component";
import { Item, Location } from "erbs-sdk";

type RouteCraftingComponentProps = {
  location: Location;
  completed: Item[];
  craftable: Item[];
  setItem: (val) => null;
};

export const RouteCraftingColumnComponent: React.FC<RouteCraftingComponentProps> = ({
  location,
  completed,
  craftable,
  setItem,
}) => {
  return (
    <Grid.Column width={3}>
      <Segment
        style={{ padding: 0, borderRadius: 0, backgroundColor: "rgba(29, 25, 25, 0.65)" }}
        textAlign="center"
        inverted
        raised
      >
        <div style={{ position: "relative" }}>
          <Image
            src={`${process.env.PUBLIC_URL}/assets/images/locations/${location.name}.jpg`}
            width={"100%"}
          />
          <Segment
            inverted
            style={{
              borderRadius: 0,
              margin: 0,
              position: "absolute",
              top: 0,
              width: "100%",
              background: `linear-gradient(180deg,rgba(255, 50, 50, 1) 0%, rgba(255, 50, 50, 0.4) 40%,rgba(255, 150, 100, 0) 90%)`,
            }}
          >
            <Header inverted>{location.name}</Header>
          </Segment>
        </div>

        {completed && completed.length > 0 && (
          <>
            <Header inverted style={{ margin: "1rem" }}>
              Loadout Items Completed
            </Header>
            {completed.map((item) => (
              <ItemModalButton id={item.id} item={item} key={item.id} />
            ))}
          </>
        )}

        <Header inverted style={{ margin: "1rem" }}>
          Items Craftable
        </Header>
        <div style={{ display: "flex", flexFlow: "row wrap", justifyContent: "center" }}>
          <div style={{ display: "block" }}></div>
          {craftable.map((item) => (
            <div key={item.id} style={{ margin: "5px" }}>
              <Label style={{ padding: 0 }} color="teal" as={Button} onClick={() => setItem(item)}>
                <img alt={item.displayName} src={getImageSrc(item.displayName)} />
              </Label>
            </div>
          ))}
        </div>
      </Segment>
    </Grid.Column>
  );
};
