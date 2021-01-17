import { Loadout, Location, MaterialList, RouteNode, Route, setStaticCache } from "erbs-sdk";
import { BasicLoadout } from "erbs-sdk/dist/types/loadout";
import { Nodes } from "../models/node.model";
import { Permutation } from "js-combinatorics/umd/combinatorics";

setStaticCache();

export class NodeService {
  private loadout: Loadout;
  private route: Route;
  constructor(loadout: BasicLoadout, private startingLocation: number) {
    this.loadout = Loadout.GenerateLoadout(loadout);

    this.route = new Route(this.loadout);
  }

  private transform(locations: number[]) {
    const base: RouteNode = {
      id: 0,
      traversed: [],
      completed: [],
      materials: new MaterialList(),
      next: null,
    };

    let currentNode = base;
    locations.forEach((locationId, i) => {
      const location = new Location(locationId);
      const newNode = this.route.generateNewNode(currentNode, location, i);

      currentNode.next = { [locationId]: newNode };

      currentNode = newNode;
    });

    return base;
  }
  private generateOrQuery(items: number[], max = 5) {
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
      query.$and.push({ [`materials.${key}`]: +val });
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
          root: response.results.map(({ locations }) => this.transform(locations)),
          routes: response.results.map(({ locations, completedItems }) => ({
            id: locations[locations.length - 1],
            traversed: locations,
            materials: new MaterialList(),
            completed: completedItems.filter((id) =>
              this.loadout.items.some((item) => item.id === id)
            ),
          })),
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
