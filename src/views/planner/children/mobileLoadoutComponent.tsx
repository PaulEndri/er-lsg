import React, { FunctionComponent, useContext } from "react";
import { Button, Segment, Icon, Image } from "semantic-ui-react";
import { getImageSrc } from "../../../utilities/getImageSrc";
import { DataContext } from "../../../state/data";
import { itemRarityBackground } from "../../../utilities/rarityColor";

export const MobileLoadoutComponent: FunctionComponent = () => {
  const { character, loadout } = useContext(DataContext);

  const slots = [
    ["Weapon", "cut"],
    ["Chest", "shield alternate"],
    ["Head", "binoculars"],
    ["Arm", "signing"],
    ["Leg", "soccer"],
    ["Accessory", "boxes"],
  ];

  const entries = slots.map(([loadoutSlot, icon]) => {
    if (!loadout[loadoutSlot]) {
      return (
        <Button style={{ width: "50px", padding: 0, margin: 5, fontSize: "smaller" }}>
          {loadoutSlot}
        </Button>
      );
    }

    const item = loadout[loadoutSlot];
    return (
      <Button
        style={{
          width: "50px",
          padding: 0,
          margin: 5,
          background: itemRarityBackground(item.rarity),
        }}
      >
        <Image src={getImageSrc(item.displayName)} />
      </Button>
    );
  });
  return (
    <Segment
      attached="bottom"
      inverted={true}
      color="black"
      secondary
      style={{
        marginTop: 0,
        marginRight: 0,
        padding: 0,

        width: "100%",
        display: "flex",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(66, 64, 74, 0.5)",
          border: "1px solid rgba(125, 125, 125, 0.1)",
          boxShadow: "0 1px 2px 0 rgba(34,36,38,.15)",
        }}
      >
        {character && character.name && (
          <img
            alt={character.name}
            width="50px"
            src={getImageSrc(`characters/mini/${character.name}`)}
          />
        )}
        {(!character || !character.name) && <Icon name="ban" />}
      </div>
      {entries}
    </Segment>
  );
};
