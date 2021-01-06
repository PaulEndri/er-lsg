import React, { useContext } from "react";
import { Button, Image, Label, Segment } from "semantic-ui-react";
import { Item } from "erbs-sdk";
import { getImageSrc } from "../utilities/getImageSrc";
import { itemRarityBackground, rarityColor } from "../utilities/rarityColor";
import { ItemModalContext } from "../state/itemModal";
import { useLocation } from "react-router-dom";
import { act } from "react-dom/test-utils";

type ItemModalButtonProps = {
  id: any;
  label?: any;
  action?: any;
  item?: any;
};

const InnerButton = React.memo<ItemModalButtonProps>(({ item, action, label }) => (
  <Button
    compact
    label={label}
    content={<Image centered rounded size="tiny" src={getImageSrc(item.displayName)} />}
    onClick={action}
    style={{
      borderRadius: 0,
      marginBottom: "5px",
      maxWidth: label ? "150px" : "100px",
      padding: 0,
      border: "2px outset rgba(255, 255, 255, 0.2)",
      background: itemRarityBackground(item.rarity),
    }}
  />
));

export const ItemModalButton: React.FC<ItemModalButtonProps> = ({ id, label, action }) => {
  const { setItem } = useContext(ItemModalContext);
  const location = useLocation();

  let item;
  try {
    item = id instanceof Item ? id : new Item(id);
  } catch (e) {
    return <div>Error {id} does not exist</div>;
  }

  const innerAction = () =>
    action
      ? action(item, location.pathname.includes("planner"))
      : setItem(item, location.pathname.includes("planner"));

  return <InnerButton id={id} item={item} label={label} action={innerAction} />;
};
