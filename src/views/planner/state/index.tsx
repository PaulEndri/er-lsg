import React, { FunctionComponent, useState } from "react";
import { Types } from "../../../utilities/types";

const initialFilterStates: Record<Types, boolean> = {
  Weapon: null,
  Chest: null,
  Head: null,
  Arm: null,
  Leg: null,
  Accessory: null,
};

const initialState = {
  filterStates: initialFilterStates,
  toggle: {
    Weapon: (value: boolean) => null,
    Chest: (value: boolean) => null,
    Head: (value: boolean) => null,
    Arm: (value: boolean) => null,
    Leg: (value: boolean) => null,
    Accessory: (value: boolean) => null,
    All: (value: Record<Types, Boolean>) => null,
  },
  massUpdate: (value: Record<Types, Boolean>) => null,
};

export const FilterContext = React.createContext(initialState);
export const FilterConsumer = FilterContext.Consumer;
export const FilterProvider: FunctionComponent = ({ children }) => {
  const [filterStates, setFilter] = useState(initialFilterStates);

  const updateFilter = (slot: Types) => (value: boolean) => {
    setFilter({ ...filterStates, [slot]: value });
  };

  const toggleMethods = Object.keys(initialFilterStates).map((type: Types) => [
    type,
    updateFilter(type),
  ]);

  const massUpdate = (val) => {
    setFilter(val);
  };
  const state = {
    filterStates,
    massUpdate,
    toggle: Object.fromEntries([...toggleMethods, ["All", massUpdate]]),
  };

  return <FilterContext.Provider value={state}>{children}</FilterContext.Provider>;
};
