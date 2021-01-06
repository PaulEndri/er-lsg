import { Item } from "erbs-sdk";
import React, { useState } from "react";

const initialState = {
  setItem: (newItem: any, addToLoadout = false) => null,
  addingToLoadout: false,
  itemHistory: [],
  item: null,
};

export const ItemModalContext = React.createContext(initialState);
export const ItemModalConsumer = ItemModalContext.Consumer;
export const ItemModalProvider: React.FC<any> = ({ children }) => {
  const [item, updateItem] = useState<Item<any>>(null);
  const [itemHistory, updateHistory] = useState<Array<Item<any>>>([]);
  const [addingToLoadout, updateAddingToLoadout] = useState(false);

  const setItem = (newItem: any, addToLoadout = false) => {
    try {
      if (!newItem) {
        updateHistory([]);
        updateItem(null);
        updateAddingToLoadout(false);

        return;
      } else if (!item) {
        updateHistory([]);
        updateItem(newItem instanceof Item ? newItem : new Item(newItem));
      } else if (itemHistory.length && itemHistory[itemHistory.length - 1].name === newItem) {
        updateItem(itemHistory[itemHistory.length - 1]);
        updateHistory(itemHistory.slice(0, itemHistory.length - 1));
      } else if (item.name !== newItem) {
        updateHistory([...itemHistory, item]);
        updateItem(newItem instanceof Item ? newItem : new Item(newItem));
      }

      if (addToLoadout) {
        updateAddingToLoadout(true);
      }
    } catch (e) {
      console.log("[state fail]", newItem, addingToLoadout, e);
      alert(e.message);
    }
  };

  const state = { item, setItem, itemHistory, addingToLoadout };

  return <ItemModalContext.Provider value={state}>{children}</ItemModalContext.Provider>;
};
