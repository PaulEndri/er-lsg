import { Categories, Character, ICharacter, Characters, Location, Loadout, Route } from "erbs-sdk";
import { MaterialList } from "erbs-sdk/dist/libs/MaterialList";
import React, { FunctionComponent, useState } from "react";
import { Types } from "../../utilities/types";
import { initialState, initialLoadout, generateEmptyDetail } from "./state";
import { ActiveRouteDetail } from "../../utilities/activeRouteDetail";
import { IPlayer } from "../../utilities/player";
import { getPlayerData } from "../../utilities/getPlayerData";

export const DataContext = React.createContext(initialState);
export const DataConsumer = DataContext.Consumer;
export const DataProvider: FunctionComponent = ({ children }) => {
  const [character, setCharacter] = useState<Character>(initialState.character);
  const [loadout, setLoadout] = useState<Loadout>(initialState.loadout);
  const [routes, setRoutes] = useState(null);
  const [activeRoute, setRoute] = useState<ActiveRouteDetail[]>(initialState.activeRoute);
  const [playerData, setPlayerData] = useState<Record<number, IPlayer>>(initialState.playerData);
  const [activePlayer, setActivePlayer] = useState<IPlayer>(null);

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

    if (!newLocation) {
      setRoute(newRouteRaw.slice(0, index));
      return;
    }

    newRouteRaw[index] = generateEmptyDetail(newLocation);
    let currentMaterialList = new MaterialList();

    if (loadout.starterItem) {
      currentMaterialList.set(loadout.starterItem, 1);
    }

    if (index === 0) {
      Route.UNIVERSAL_BASE_ITEMS.forEach((item) => {
        currentMaterialList.add(item, 5);
      });
    } else if (index === 1) {
      Route.UNIVERSAL_UNLOCK_ITEMS.forEach((item) => {
        currentMaterialList.add(item, 3);
      });
    } else if (index === 2) {
      Route.UNIVERSAL_BOSS_ITEMS.forEach((item) => currentMaterialList.add(item, 1));
    }

    const newRouteDetails = newRouteRaw.map(
      ({ location, craftableItems, materials, completed }, idx) => {
        if (idx < index) {
          currentMaterialList.addFromList(materials.list);

          return { location, materials: currentMaterialList.clone(), completed, craftableItems };
        } else if (location) {
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
        } else {
          return generateEmptyDetail();
        }
      }
    );

    const newNextStep = newRouteDetails[index + 1];
    const newStep = newRouteDetails[index];

    if (
      !newNextStep ||
      !newNextStep.location ||
      newStep.location.connections.some(({ id }) => id === newNextStep.location.id)
    ) {
      return setRoute(newRouteDetails);
    }

    setRoute(
      newRouteDetails.map((val, idx) => {
        if (idx <= index) {
          return val;
        }

        return generateEmptyDetail();
      })
    );
  };

  const updatePlayerData = (id: number, data: IPlayer) => {
    if (!id || !data) {
      console.error(id, data);
      throw new Error("Bad Data");
    }

    setPlayerData({
      ...playerData,
      [id]: data,
    });
  };

  const fetchPlayerData = async (id: number | string) => {
    if (typeof id === "string") {
      // search local first
      const localVal = Object.values(playerData).find(({ name }) => name === id);

      if (localVal) {
        return localVal;
      }

      const results = await getPlayerData(id);

      if (results.error !== true) {
        setPlayerData({
          ...playerData,
          [+results.data.id]: results.data,
        });

        setActivePlayer(results.data);
      } else {
        return results;
      }
    } else {
      setActivePlayer(playerData[id] || null);
    }
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
    playerData,
    setPlayerData,
    setRoute,
    updatePlayerData,
    getPlayerData: fetchPlayerData,
    activePlayer,
  };

  return <DataContext.Provider value={state as any}>{children}</DataContext.Provider>;
};
