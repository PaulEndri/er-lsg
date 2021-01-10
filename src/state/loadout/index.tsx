import { Categories, Character, ICharacter, Characters, Location, Loadout, Item } from "erbs-sdk";
import { MaterialList } from "erbs-sdk/dist/libs/MaterialList";
import React, { FunctionComponent, useState } from "react";
import { Types } from "../../utilities/types";

type ActiveRouteDetail = {
  location: Location;
  materials: MaterialList;
  craftableItems: Item[];
  completed: Item[];
};

const initialLoadout = {
  Weapon: null,
  Chest: null,
  Head: null,
  Arm: null,
  Leg: null,
  Accessory: null,
};

const defaultCharacter = Math.floor(Math.random() * Object.keys(Character.SOURCES).length);
const initialState = {
  loadout: Loadout.GenerateLoadout(initialLoadout),
  character: new Character(defaultCharacter),
  updateCharacter: (character: ICharacter | Character | keyof typeof Characters) => null,
  updateLoadout: (slot, item) => null,
  routes: null,
  setRoutes: (routes: any) => null,
  activeRoute: [] as ActiveRouteDetail[],
  setRoute: (routes: ActiveRouteDetail[]) => null,
  updateActiveRoute: (index: number, newLocation: Location) => null,
};

export const LoadoutContext = React.createContext(initialState);
export const LoadoutConsumer = LoadoutContext.Consumer;
export const LoadoutProvider: FunctionComponent = ({ children }) => {
  const [character, setCharacter] = useState<Character>(initialState.character);
  const [loadout, setLoadout] = useState<Loadout>(initialState.loadout);
  const [routes, setRoutes] = useState(null);
  const [activeRoute, setRoute] = useState<ActiveRouteDetail[]>([]);

  const updateCharacter = (character: ICharacter | Character | keyof typeof Characters) => {
    if (character instanceof Character) {
      setCharacter(character);
    } else if (character) {
      setCharacter(new Character(character));
    } else {
      setCharacter(null);
    }
  };

  const updateLoadout = (slot, item) => {
    if (!slot) {
      setLoadout(Loadout.GenerateLoadout(initialLoadout));
    } else {
      setLoadout(loadout.setSlot(item.category === Categories.Weapon ? Types.Weapon : slot, item));
    }
  };

  const updateActiveRoute = (index: number, newLocation: Location) => {
    const newRouteRaw = [...activeRoute];
    newRouteRaw[index] = {
      location: newLocation,
      materials: null,
      craftableItems: [],
      completed: [],
    };
    let currentMaterialList = new MaterialList();

    if (loadout.starterItem) {
      currentMaterialList.set(loadout.starterItem, 1);
    }

    const newRouteDetails = newRouteRaw.map(
      ({ location, craftableItems, materials, completed }, idx) => {
        if (idx < index) {
          currentMaterialList.addFromList(materials.list);

          return { location, materials: currentMaterialList.clone(), completed, craftableItems };
        } else {
          const newMaterialList = currentMaterialList.clone();
          newMaterialList.addFromList(location.materials.list);

          const completed = loadout.checkCompletedItems(newMaterialList.list);
          currentMaterialList = newMaterialList;
          return {
            location,
            materials: newMaterialList,
            completed,
            craftableItems: newMaterialList.getAllCraftableItems(),
          };
        }
      }
    );

    setRoute(newRouteDetails);
  };

  const state = {
    character,
    routes,
    setRoutes,
    loadout,
    updateCharacter,
    updateLoadout,
    activeRoute,
    updateActiveRoute,
    setRoute,
  };

  return <LoadoutContext.Provider value={state as any}>{children}</LoadoutContext.Provider>;
};
