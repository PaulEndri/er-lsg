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
    return {
      itemsCompleted: {
        $or: perms.map((partialItems) => ({
          $all: partialItems,
        })),
      },
    };
  }

  public async getCompleteItems() {
    const itemIds = this.loadout.items.map(({ id }) => +id);
    const query = {
      itemsCompleted: { $all: itemIds },
    };

    let response;

    if (this.startingLocation) {
      query["locations.0"] = this.startingLocation;
    }
    console.log("[test]", query);
    const results = await Nodes.find(query, [], { lean: true });

    if (results && results.length) {
      response = {
        results,
        partial: false,
        message: "Found all six",
      };
    } else {
      let partialResults = {
        partial: true,
        results: [],
        message: "Bad loadout",
      };

      let items = 5;
      while (items >= 3 && partialResults.results.length === 0) {
        const newQuery = this.generateOrQuery(itemIds, items);

        if (this.startingLocation) {
          newQuery["locations.0"] = this.startingLocation;
        }
        const newResults = await Nodes.find(newQuery as any, [], { lean: true });

        if (newResults.length && newResults.length) {
          partialResults.results = newResults;
          partialResults.message = `Found ${items} items`;
        }

        items--;
      }

      response = partialResults;
    }

    if (response.results) {
      response.results = {
        root: response.results.map(({ locations }) => this.transform(locations)),
        routes: response.results.map(({ locations, completedItems }) => ({
          id: locations[locations.length - 1],
          traversed: locations,
          materials: new MaterialList(),
          completed: completedItems.filter((id) =>
            this.loadout.items.some((item) => item.id === id)
          ),
        })),
      };
    }

    return response;
  }
}
