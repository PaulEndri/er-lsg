import React, { FunctionComponent, useContext } from "react";
import { Button, Header, Image, Label, List, Segment } from "semantic-ui-react";
import { Item } from "erbs-sdk";
import { getImageSrc } from "../utilities/getImageSrc";
import { itemRarityBackground, rarityColor } from "../utilities/rarityColor";
import { ItemModalButton } from "./itemModalButton.component";
import { ItemModalContext } from "../state/itemModal";
import { getInterpretedString } from "../utilities/interpretStat";

type ItemCardProps = {
  item?: Item<string>;
  showReqs?: boolean;
  adding?: boolean;
};

export const ItemCardComponent: FunctionComponent<ItemCardProps> = ({ item, showReqs }) => {
  const { setItem } = useContext(ItemModalContext);
  return (
    <Segment.Group
      style={{
        backgroundColor: "rgba(66, 64, 74, 0.2)",
      }}
    >
      {item && (
        <React.Fragment>
          <Segment basic compact textAlign="center">
            <Button
              color={rarityColor(item.rarity)}
              as="a"
              href={`https://eternalreturn.gamepedia.com/${item.name}`}
              content={item.displayName}
              style={{ marginBottom: "1.5rem", marginTop: "1rem" }}
              label={item.clientType}
            />
            <Segment
              basic
              inverted={true}
              raised
              style={{
                // backgroundColor: '#877e8a',
                margin: "auto",
                marginBottom: "10px",
                padding: "1px",
                border: "2px inset rgba(255, 190, 16, 0.45)",
                maxWidth: "275px",
                overflow: "hidden",
                background: itemRarityBackground(item.rarity),
              }}
            >
              <Image floated="right" src={getImageSrc(item.displayName)} fluid bordered />
            </Segment>

            <div style={{ color: "white", fontStyle: "italic" }}>{item.description}</div>
          </Segment>
          {item.stats && Object.keys(item.stats).length > 0 && (
            <Segment inverted={true} raised style={{ backgroundColor: "transparent" }}>
              <Header>Stats</Header>
              <List
                items={Object.entries(item.stats).map(([name, val]: any) =>
                  getInterpretedString(name, val)
                )}
              />
            </Segment>
          )}
          {item.buildsFrom && item.buildsFrom.length > 0 && (
            <Segment inverted={true} style={{ backgroundColor: "transparent" }}>
              <Header>Built From</Header>
              {item.buildsFrom.map(({ name, id }, idx) => (
                <ItemModalButton key={`${name}${id}`} id={id} />
              ))}
            </Segment>
          )}
          {item.buildsInto && Object.entries(item.buildsInto).length > 0 && (
            <Segment inverted={true} style={{ backgroundColor: "transparent" }}>
              <Header>Builds Into</Header>
              {item.buildsInto.map((item, idx) => (
                <ItemModalButton key={item.id} id={item.id} />
              ))}
            </Segment>
          )}
          {item.locations && Object.keys(item.locations).length > 0 && (
            <Segment inverted={true} style={{ backgroundColor: "transparent" }}>
              <Header inverted={true}>Found In</Header>
              {Object.entries(item.locations).map(([location, value]) => (
                <Label key={location} detail={value} content={location} color="yellow" />
              ))}
            </Segment>
          )}
          {item.droppedFrom && item.droppedFrom.length > 0 && (
            <Segment inverted={true} style={{ backgroundColor: "transparent" }}>
              <Header inverted={true}>Dropped From</Header>
              {item.droppedFrom.map(({ name }) => (
                <Label key={name} content={name} color="red" />
              ))}
            </Segment>
          )}

          {item.materials && showReqs && Object.entries(item.materials).length > 0 && (
            <Segment inverted={true} style={{ backgroundColor: "transparent" }} basic>
              <Label style={{ width: "100%", textAlign: "center" }} color="red">
                Total Material Requirements
              </Label>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexWrap: "wrap",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                {Object.entries(item.materials).map(([material, quantity], key) => (
                  <div style={{ margin: "5px" }}>
                    <Label image key={key + material} onClick={() => setItem(material)}>
                      <img alt={material} src={getImageSrc(material)} />
                      {quantity}
                    </Label>
                  </div>
                ))}
              </div>
            </Segment>
          )}
        </React.Fragment>
      )}
      {!item && (
        <Segment
          attached="top"
          basic
          textAlign="center"
          placeholder
          inverted={true}
          style={{ border: 0 }}
        >
          No Item Selected
        </Segment>
      )}
    </Segment.Group>
  );
};
