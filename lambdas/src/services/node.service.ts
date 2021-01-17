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

  private transform(results: DataNode[]) {
    const base: RouteNode = {
      id: 0,
      traversed: [],
      completed: [],
      materials: new MaterialList(),
      next: {},
    };

    results.forEach(({ locations, materials }) => {
      let currentNode = base;
      locations.forEach((locationId, i) => {
        const location = new Location(locationId);

        if (!currentNode.next || currentNode.next[locationId]) {
          const newNode = this.route.generateNewNode(currentNode, location, i);

          if (currentNode.next) {
            currentNode.next[locationId] = newNode;
          } else {
            currentNode.next = { [locationId]: newNode };
          }

          currentNode = newNode;
        } else {
          currentNode = currentNode.next[locationId];
        }
      });
    });

    return base;
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
        results: {
          root: this.transform(results),
          routes: results
            .map(({ locations, materials }) => ({
              id: locations.join("-"),
              traversed: locations,
              materials: null,
              completed: this.loadout.checkCompletedItems(materials),
            }))
            .sort((a, b) => b.completed.length - a.completed.length),
        },
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
