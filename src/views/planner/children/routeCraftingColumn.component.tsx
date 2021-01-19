import React from "react";
import { Grid, Header, Button, Label, Image, Segment } from "semantic-ui-react";
import { getImageSrc } from "../../../utilities/getImageSrc";
import { ItemModalButton } from "../../../components/itemModalButton.component";
import { Character, Item, Location } from "erbs-sdk";
import { SectionComponent } from "../../../components/section.component";
import { itemRarityBackground } from "../../../utilities/rarityColor";
import { IS_MOBILE } from "../../../components/isMobile";

type RouteCraftingComponentProps = {
  location: Location;
  completed: Item[];
  craftable: Item[];
  setItem: (val) => null;
  character?: Character;
};

export const RouteCraftingColumnComponent: React.FC<RouteCraftingComponentProps> = ({
  location,
  completed,
  craftable,
  setItem,
}) => {
  const craftableSets = {};

  craftable.forEach((item) => {
    const type = item.category === "Weapon" ? "Weapon" : item.clientType;

    if (!craftableSets[type]) {
      craftableSets[type] = [];
    }

    craftableSets[type].push(item);
  });

  return (
    <Grid.Column width={IS_MOBILE ? 14 : 3}>
      <Segment
        style={{ padding: 0, backgroundColor: "rgba(29, 25, 25, 1)" }}
        textAlign="center"
        inverted={true}
        raised
      >
        <div style={{ position: "relative" }}>
          <Image
            src={`${process.env.PUBLIC_URL}/assets/images/locations/${location.name}.jpg`}
            width={"100%"}
          />
          <Segment
            inverted={true}
            style={{
              margin: 0,
              position: "absolute",
              top: 0,
              width: "100%",
              background: `linear-gradient(180deg,rgba(245, 196, 102, 1) 0%, rgba(195, 146, 52, 0.6) 40%,rgba(245, 196, 102, 0) 90%)`,
            }}
          >
            <Header inverted={true}>{location.name}</Header>
          </Segment>
        </div>

        {completed && completed.length > 0 && (
          <>
            <Header inverted={true} style={{ margin: "1rem" }}>
              Loadout Items Completed
            </Header>
            {completed.map((item) => (
              <ItemModalButton id={item.id} item={item} key={item.id} />
            ))}
          </>
        )}

        <Header inverted={true} style={{ margin: "1rem" }}>
          Items Craftable
        </Header>
        {Object.entries<Item[]>(craftableSets).map(([name, entries], idx) => (
          <SectionComponent
            title={name}
            key={name + idx}
            headerStyle={{
              padding: 4,
              marginTop: 0,
              borderTopWidth: 1,
              textAlign: "left",
              paddingLeft: "1em",
            }}
            contentStyle={{ margin: 0, padding: 0 }}
          >
            <div style={{ display: "flex", flexFlow: "row wrap", justifyContent: "center" }}>
              {entries.map((item) => (
                <div key={item.id} style={{ margin: "5px" }}>
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
                    onClick={() => setItem(item)}
                  >
                    <img alt={item.displayName} src={getImageSrc(item.displayName)} />
                  </Label>
                </div>
              ))}
              <div style={{ display: "block" }}></div>
            </div>
          </SectionComponent>
        ))}
      </Segment>
    </Grid.Column>
  );
};
