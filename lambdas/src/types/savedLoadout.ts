import { BasicLoadout } from "erbs-sdk/dist/types/loadout";
import { RouteNode } from "erbs-sdk";
export interface ISavedLoadout {
  name: string;
  id: string;
  userId: any;
  createdAt: Date;
  loadout: BasicLoadout;
  routeData: {
    root: RouteNode;
    routes: RouteNode[];
  };
}
