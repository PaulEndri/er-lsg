import { Location, Item } from "erbs-sdk";
import { MaterialList } from "erbs-sdk/dist/libs/MaterialList";

export type ActiveRouteDetail = {
  location: Location;
  materials: MaterialList;
  craftableItems: Item[];
  completed: Item[];
};
