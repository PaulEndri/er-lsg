import { Character, ICharacter, Characters, Location, Loadout, setStaticCache } from "erbs-sdk";
import { IPlayer } from "../../utilities//player";
import { ActiveRouteDetail } from "../../utilities/activeRouteDetail";
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

const defaultCharacter = Math.floor(Math.random() * Object.keys(Characters).length);

export const initialState = {
  loadout: Loadout.GenerateLoadout(initialLoadout),
  character: new Character(defaultCharacter),
  updateCharacter: (character: ICharacter | Character | keyof typeof Characters) => null,
  updateLoadout: (slot, item) => null,
  routes: null,
  setRoutes: (routes: any) => null,
  activeRoute: new Array(5).fill(generateEmptyDetail()) as ActiveRouteDetail[],
  setRoute: (routes: ActiveRouteDetail[]) => null,
  updateActiveRoute: (index: number, newLocation: Location) => null,
  playerData: {} as Record<number, IPlayer>,
  activePlayer: null as IPlayer,
  updatePlayerData: (id: number, data: IPlayer) => null,
  getPlayerData: (id: number) => Promise.resolve({} as IPlayer),
};
