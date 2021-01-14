import { Categories, Character, ICharacter, Characters, Location, Loadout, Route } from "erbs-sdk";
import { MaterialList } from "erbs-sdk/dist/libs/MaterialList";
import React, { FunctionComponent, useState } from "react";
import { Types } from "../../utilities/types";
import { initialState, initialLoadout, generateEmptyDetail } from "./state";
import { ActiveRouteDetail } from "../../utilities/activeRouteDetail";
import { IPlayer } from "../../utilities/player";
import { getPlayerData } from "../../utilities/getPlayerData";
import * as NetlifyIdentityWidget from "netlify-identity-widget";
import { ISavedLoadout } from "../../utilities/savedLoadout";
import { saveUserLoadout } from "../../utilities/saveUserLoadout";
import { getSavedLoadout } from "../../utilities/getSavedLoadouts";

NetlifyIdentityWidget.init();

const defaultUser = NetlifyIdentityWidget.currentUser();

const netlifyIdentifySetup = (setUser) => {
  NetlifyIdentityWidget.on("init", (user) => {
    if (user && user.id) {
      setUser(user);
    }
  });

  NetlifyIdentityWidget.on("login", (user) => {
    setUser(user);
  });

  NetlifyIdentityWidget.on("logout", () => {
    setUser(null);
  });
};

export const DataContext = React.createContext(initialState);
export const DataConsumer = DataContext.Consumer;
export const DataProvider: FunctionComponent = ({ children }) => {
  const [character, setCharacter] = useState<Character>(initialState.character);
  const [loadout, setLoadout] = useState<Loadout>(initialState.loadout);
  const [routes, setRoutes] = useState(null);
  const [activeRoute, setRoute] = useState<ActiveRouteDetail[]>(initialState.activeRoute);
  const [playerData, setPlayerData] = useState<Record<number, IPlayer>>(initialState.playerData);
  const [activePlayer, setActivePlayer] = useState<IPlayer>(null);
  const [user, setUser] = useState<NetlifyIdentityWidget.User>(defaultUser || null);
  const [savedLoadouts, setSavedLoadouts] = useState<ISavedLoadout[]>([]);
  const [loadoutName, setLoadoutName] = useState<string>();
  const [currentSavedLoadoutId, setCurrentSavedLoadoutId] = useState<string>();

  netlifyIdentifySetup(setUser);

  const injectLoadout = (savedLoadout: ISavedLoadout) => {
    setLoadout(Loadout.GenerateLoadout(savedLoadout.loadout));
    setLoadoutName(savedLoadout.name);
    setCurrentSavedLoadoutId(savedLoadout.id);
    setRoutes(savedLoadout.routeData);
  };

  const deleteLoadout = async (loadoutId: string) => {
    const deleting = savedLoadouts.find((l) => l.id === loadoutId);

    const hackedLoadout: any = {
      ...deleting,
      delete: true,
    };

    const results = await saveUserLoadout(hackedLoadout);

    if (!results.error) {
      setSavedLoadouts(savedLoadouts.filter((sl) => sl.id !== loadoutId));
    } else {
      throw results.message;
    }
  };
  const loadLoadout = (loadoutId: string) => {
    const loadingLoadout = savedLoadouts.find((l) => l.id === loadoutId);

    if (loadingLoadout) {
      injectLoadout(loadingLoadout);
    }
  };

  const getLoadout = async (loadoutId?: string) => {
    let response = await getSavedLoadout(loadoutId ? null : user.id, loadoutId);

    if (!response.error) {
      if (loadoutId) {
        const newLoadout = response.data[0];
        if (newLoadout) {
          injectLoadout(newLoadout);
        } else {
          throw new Error("Loadout not found");
        }
      }

      setSavedLoadouts([...savedLoadouts, ...response.data]);
    }
  };

  const saveLoadout = async (name: string) => {
    if (!user || !user.id) {
      throw new Error("Please Sign In");
    }

    const payload: ISavedLoadout = {
      name,
      id: currentSavedLoadoutId,
      userId: user.id,
      loadout: {
        Weapon: loadout.Weapon?.name,
        Arm: loadout.Arm?.name,
        Leg: loadout.Leg?.name,
        Chest: loadout.Chest?.name,
        Accessory: loadout.Accessory?.name,
        Head: loadout.Head?.name,
      },
      routeData: routes,
    };

    const response = await saveUserLoadout(payload);

    if (!response.error) {
      setLoadoutName(name);
      setSavedLoadouts([...savedLoadouts, response.data]);
      setCurrentSavedLoadoutId(response.data.id);
    } else {
      throw new Error(response.message);
    }

    return response;
  };

  const updateCharacter = (character: ICharacter | Character | keyof typeof Characters) => {
    if (character instanceof Character) {
      setCharacter(character);
    } else if (character) {
      setCharacter(new Character(character));
    } else {
      setCharacter(null);
    }
  };

  const updateLoadout = (slot?, item?) => {
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
    user,
    loadLoadout,
    getLoadout,
    saveLoadout,
    savedLoadouts,
    loadoutName,
    deleteLoadout,
    setSavedLoadouts,
    currentSavedLoadoutId,
  };

  return <DataContext.Provider value={state as any}>{children}</DataContext.Provider>;
};
