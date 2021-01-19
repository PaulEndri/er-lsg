import { Character, ICharacter, Characters, Location, Loadout, setStaticCache } from "erbs-sdk";
import { IPlayer } from "../../utilities/player";
import { ISavedLoadout } from "../../utilities/savedLoadout";

import { ActiveRouteDetail } from "../../utilities/activeRouteDetail";
import { DefaultPlayerData } from "../../utilities/playerData";

setStaticCache();

export const initialLoadout = {
  Weapon: null,
  Chest: null,
  Head: null,
  Arm: null,
  Leg: null,
  Accessory: null,
};

export const generateEmptyDetail = (val = null) => ({
  location: val,
  materials: null,
  craftableItems: [],
  completed: [],
});

const defaultCharacter = Math.ceil((Math.random() * Object.keys(Characters).length) / 2);

let defaultStateValues = {
  loadout: Loadout.GenerateLoadout(initialLoadout),
  character: new Character(defaultCharacter),
  routes: null,
  activeRoute: new Array(5).fill(generateEmptyDetail()) as ActiveRouteDetail[],
  playerData: { 749761: DefaultPlayerData as any } as Record<number, IPlayer>,
  activePlayer: null as IPlayer,
  savedLoadouts: [] as ISavedLoadout[],
};

export const initialState = {
  updateCharacter: (character: ICharacter | Character | keyof typeof Characters) => null,
  updateLoadout: (slot, item) => null,
  fetchRoutes: () => Promise.resolve(null),
  setRoute: (routes: ActiveRouteDetail[]) => null,
  updateActiveRoute: (index: number, newLocation: Location) => null,
  updatePlayerData: (id: number, data: IPlayer) => null,
  getPlayerData: (id: number) => Promise.resolve({} as IPlayer),
  saveLoadout: (name: string) => Promise.resolve({} as ISavedLoadout),
  getLoadout: (loadoutId?: string) => Promise.resolve([] as ISavedLoadout[]),
  loadLoadout: (loadoutId: string) => null,
  deleteLoadout: (loadoutId: string) => Promise.resolve(),
  setSavedLoadouts: (loadouts: any) => null,
  user: null,
  loadoutName: null,
  currentSavedLoadoutId: null,
  ...defaultStateValues,
};
