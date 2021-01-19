import { Categories, Item } from "erbs-sdk";
import React, { useContext } from "react";
import { Button, Icon, Modal, Segment } from "semantic-ui-react";
import { ItemModalContext } from "../state/itemModal";
import { DataContext } from "../state/data";
import { ItemCardComponent } from "./itemCard.component";
import IsMobile from "./isMobile";
import IsDesktop from "./isDesktop";

export const ItemModalComponent = () => {
  const { item, setItem, itemHistory, addingToLoadout } = useContext(ItemModalContext);
  const { updateLoadout } = useContext(DataContext);
  const itemData = item ? (item instanceof Item ? item : new Item(item)) : null;
  const addableItem =
    itemData && [Categories.Armor, Categories.Weapon].includes(itemData.category as any);

  return (
    <Modal basic onClose={() => setItem(null)} open={item} size="small">
      <Modal.Content style={{ width: "100%", paddingBottom: 0 }}>
        <div
          style={{
            maxWidth: "450px",
            backgroundColor: "rgba(33, 32, 36, 1)",
            padding: "0.5em",
            textAlign: "right",
            margin: "auto",
          }}
        >
          <Icon name="close" size="large" onClick={() => setItem(null)} />
        </div>
        <div
          style={{
            maxWidth: "450px",
            backgroundColor: "rgba(66, 64, 74, 1)",
            textAlign: "center",
            margin: "auto",
          }}
        >
          <ItemCardComponent item={item} />
        </div>
        <IsMobile>
          <div
            style={{
              maxWidth: "450px",
              backgroundColor: "rgba(33, 32, 31, 1)",
              textAlign: "center",
              padding: "5px",
              margin: "auto",
              marginBottom: "100px",
            }}
          >
            {addingToLoadout && addableItem && (
              <Button
                onClick={() => {
                  setItem(null, false);
                  updateLoadout(itemData.clientType, itemData);
                }}
                content={`Add to Loadout`}
                color="green"
              />
            )}
            <Button color="red" onClick={() => setItem(null, false)}>
              <Icon name="close" />
              Close
            </Button>
          </div>
        </IsMobile>
      </Modal.Content>

      <Modal.Actions style={{ paddingTop: 0 }}>
        <IsDesktop>
          <div style={{ maxWidth: "450px", margin: "auto" }}>
            <Segment
              color="black"
              inverted
              style={{ marginTop: 0, paddingLeft: 0, paddingRight: 0 }}
            >
              {itemHistory && itemHistory.length > 0 && (
                <Button
                  color="yellow"
                  onClick={() => setItem(itemHistory[itemHistory.length - 1].name)}
                >
                  <Icon name="backward" />
                  Back
                </Button>
              )}
              {addingToLoadout && addableItem && (
                <Button
                  onClick={() => {
                    setItem(null, false);
                    updateLoadout(itemData.clientType, itemData);
                  }}
                  content={`Add to Loadout`}
                  color="green"
                />
              )}
              <Button color="red" onClick={() => setItem(null, false)}>
                <Icon name="close" />
                Close
              </Button>
            </Segment>
          </div>
        </IsDesktop>
      </Modal.Actions>
    </Modal>
  );
};
