import { Loadout, Location, MaterialList, RouteNode, Route, setStaticCache } from "erbs-sdk";
import { BasicLoadout } from "erbs-sdk/dist/types/loadout";
import { DataNode, Nodes } from "../models/node.model";
import { Permutation } from "js-combinatorics/umd/combinatorics";

setStaticCache();

export class NodeService {
  private loadout: Loadout;
  private route: Route;
  constructor(loadout: BasicLoadout, private startingLocation: number) {
    this.loadout = Loadout.GenerateLoadout(loadout);

    this.route = new Route(this.loadout);
  }

  private transform(results: Array<DataNode>) {
    const base: RouteNode = {
      id: 0,
      traversed: [],
      completed: [],
      materials: new MaterialList(),
      next: {},
    };

    const data = results
      .map((result) => {
        const { locations } = result;
        const completed = this.loadout.checkCompletedItems(result.materials);
        let currentNode = base;
        let routeWeaponValue = 0;

        locations.forEach((locationId, i) => {
          const location = new Location(locationId);
          if (!currentNode.next || !currentNode.next[locationId]) {
            const newNode = this.route.generateNewNode(currentNode, location, i);

            if (currentNode.next) {
              currentNode.next[locationId] = newNode;
            } else {
              currentNode.next = { [locationId]: newNode };
            }

            if (!routeWeaponValue && currentNode.completed.length !== newNode.completed.length) {
              if (
                this.loadout
                  .checkCompletedItems(newNode.materials.list)
                  .includes(this.loadout.Weapon)
              ) {
                routeWeaponValue = 7 - 1;
              }
            }
            currentNode = newNode;
          } else {
            currentNode = currentNode.next[locationId];
          }
        });

        return {
          routeWeaponValue,
          id: locations.join("-"),
          traversed: locations,
          materials: null,
          completed,
        };
      })
      .sort(
        (a, b) => b.routeWeaponValue - a.routeWeaponValue || b.completed.length - a.completed.length
      );

    return {
      root: base,
      routes: data,
    };
  }

  public generateOrQuery(items: number[], max = 5) {
    const perms: number[][] = [...new Permutation(items), max];
    const query = {
      $or: perms.map((partialItems) => ({
        itemsCompleted: { $all: partialItems },
      })),
    };

    console.log(query);

    return query;
  }

  public async getCompleteItems() {
    const query = { $and: [] };

    Object.entries(this.loadout.materials).forEach(([key, val]) => {
      query.$and.push({ [`materials.${key}`]: { $gte: +val } });
    });

    let response;

    if (this.startingLocation) {
      query["locations.0"] = this.startingLocation;
    }
    console.log("[test]", JSON.stringify(query));
    const results = await Nodes.find(query, [], { lean: true });

    if (results && results.length) {
      response = {
        results: this.transform(results),
        message: "Found all six",
      };
    } else {
      response = {
        results: this.route.generate(this.startingLocation),
        message: "Bad loadout",
      };
    }

    return response;
  }
}
