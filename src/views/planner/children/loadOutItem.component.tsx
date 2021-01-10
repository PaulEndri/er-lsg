import React from "react";
import { Button, Image, Menu } from "semantic-ui-react";
import { getImageSrc } from "../../../utilities/getImageSrc";
import { itemRarityBackground } from "../../../utilities/rarityColor";

export const LoadOutItemComponent = ({ item, onClick, type }) => {
  if (!item || !item.name) {
    return (
      <Menu.Item
        className="fancy-hover"
        onClick={() => onClick(null, type)}
        style={{ borderRadius: "0px" }}
      >
        {type}
      </Menu.Item>
    );
  }
  return (
    <Menu.Item
      className="fancy-hover"
      onClick={() => onClick(item, type)}
      style={{
        borderRadius: "0px",
      }}
    >
      <Button
        fluid
        style={{
          margin: 0,
          padding: 0,
          borderRadius: 0,
          background: itemRarityBackground(item.rarity),
          border: "2px outset rgba(200, 200, 200, 0.5)",
        }}
      >
        <Image
          style={{ borderRadius: 0 }}
          centered
          size="tiny"
          src={getImageSrc(item.displayName)}
        />
      </Button>
    </Menu.Item>
  );
};
