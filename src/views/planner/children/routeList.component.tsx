import React from "react";
import { Segment, Header, Button, Icon, Image, Table } from "semantic-ui-react";
import { getImageSrc } from "../../../utilities/getImageSrc";
import { Item, Location, Locations, RouteNode, MaterialList } from "erbs-sdk";
import { itemRarityBackground } from "../../../utilities/rarityColor";

type Props = {
  root: RouteNode;
  setRoute: (routes) => null;
  routes: RouteNode[];
  moveToCrafting: () => null;
};

export const RouteListComponent: React.FC<Props> = ({ root, setRoute, routes, moveToCrafting }) => {
  if (!routes || routes.length === 0) {
    return (
      <Segment color="red" inverted style={{ borderRadius: 0 }}>
        <Header>No Routes Found</Header>
        <div>
          This means either the loadout isn't complete (Hint: Make sure you have all six items) or
          the build is too complex to have at least 3 items completed within 4 zones.
        </div>
      </Segment>
    );
  }

  const handleClick = (route: RouteNode) => {
    const newActiveRoute = route.traversed.map((id, index) => {
      let workingRoot = root;

      for (let i = 0; i <= index; i++) {
        workingRoot = workingRoot.next[route.traversed[i]];
      }

      const materialList = workingRoot.materials as MaterialList;
      return {
        location: new Location(id),
        craftableItems: materialList.getAllCraftableItems(),
        materials: materialList,
        completed: route.completed.slice(0, index).map((id) => new Item(id)),
      };
    });

    setRoute(newActiveRoute);
    moveToCrafting();
  };

  return (
    <Table inverted celled striped collapsing>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell textAlign="center" colSpan="6">
            Generated Routes
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      {routes.slice(0, 20).map((route, idx) => {
        const getTraversedRoot = (index) => {
          let traversedRoot = root;

          route.traversed.slice(0, index + 1).forEach((loc) => {
            traversedRoot = traversedRoot.next[loc];
          });

          return traversedRoot;
        };
        return (
          <>
            <Table.Header>
              <Table.Row>
                {route.traversed.map((location) => (
                  <Table.HeaderCell textAlign="center" key={location}>
                    {Locations[location]}
                  </Table.HeaderCell>
                ))}
                <Table.HeaderCell></Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                {route.traversed.map((loc, index) => (
                  <Table.Cell key={loc}>
                    {getTraversedRoot(index).completed.map((id) => {
                      const item = new Item(id);
                      return (
                        <Image
                          inline
                          centered
                          src={getImageSrc(item.displayName)}
                          width={50}
                          height={30}
                          circular
                          style={{
                            background: itemRarityBackground(item.rarity),
                            boxShadow: "1px 1px 4px 1px rgba(0, 0, 0, 0.5)",
                            margin: "4px",
                          }}
                        />
                      );
                    })}
                  </Table.Cell>
                ))}
                <Table.Cell>
                  <Button
                    compact
                    color="green"
                    onClick={() => handleClick(route)}
                    attached="right"
                    style={{ borderRadius: 0 }}
                  >
                    <div style={{ textAlign: "center", alignSelf: "center" }}>
                      See Route Details
                      <br />
                      <Icon
                        size="large"
                        name="chevron circle right"
                        style={{ marginTop: "12px" }}
                      />
                    </div>
                  </Button>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </>
        );
      })}
    </Table>
  );
};
