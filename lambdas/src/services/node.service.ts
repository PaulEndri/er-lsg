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

            if (
              !routeWeaponValue &&
              currentNode.completed.length !== newNode.completed.length &&
              this.loadout.Weapon
            ) {
              if (
                this.loadout
                  .checkCompletedItems(newNode.materials.list)
                  .map(({ id }) => id)
                  .includes(this.loadout.Weapon.id)
              ) {
                routeWeaponValue = 7 - i;
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
      routes: data.slice(0, 100),
    };
  }

  private async checkQueryForPoints(query, points = 5) {
    try {
      const results = await Nodes.find({ ...query, point: { $lte: points } }, [], { lean: true });

      if (results && results.length > 0) {
        return {
          results: this.transform(results),
          message: `Found values with ${points}`,
        };
      }
    } catch (e) {
      console.warn("[Failed on Early Results]", e);
    }

    return null;
  }

  public generateOrQuery(items: number[], max = 5) {
    const perms: number[][] = [...new Permutation(items), max];
    const query = {
      $or: perms.map((partialItems) => ({
        itemsCompleted: { $all: partialItems },
      })),
    };

    return query;
  }

  public async getCompleteItems() {
    const query = { $and: [] };

    Object.entries(this.loadout.materials).forEach(([key, val]) => {
      query.$and.push({ [`materials.${key}`]: { $gte: +val } });
    });

    if (this.startingLocation) {
      query["locations.0"] = this.startingLocation;
    }

    const pointValues = [3, 4, 5];

    console.log("[test]", JSON.stringify(query));

    for (const point of pointValues) {
      const results = await this.checkQueryForPoints(query, point);

      if (results) {
        return results;
      }
    }

    return {
      results: this.route.generate(this.startingLocation),
      message: "Bad loadout",
    };
  }
}
