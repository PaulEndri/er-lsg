import React, { useState } from "react";
import { Segment, Header, Button, Icon, Image, Table, Pagination, Select } from "semantic-ui-react";
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
  const [activePage, updateActivePage] = useState(0);
  const [tableFilters, updateTableFilters] = useState(new Array(5).fill(null));

  const changeFilter = (index, val) => {
    const newTableFilters = tableFilters.map((currentValue, i) =>
      i === index ? val : currentValue
    );

    updateActivePage(0);
    updateTableFilters(newTableFilters);
  };

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

  const getPage = () => {
    if (routes.length > 10) {
      return routes
        .filter((route) =>
          tableFilters && tableFilters.length
            ? tableFilters.every((f, i) => !f || route.traversed[i] === f)
            : true
        )
        .slice(activePage * 10, activePage * 10 + 10);
    } else {
      return routes;
    }
  };

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

  const locOptions = [{ key: 999, value: null, text: "Automatic" }].concat(
    Object.entries(Locations)
      .filter(([x]) => isNaN(x as any))
      .map(([name, value]: [string, number]) => ({
        key: value,
        text: name,
        value: value,
      }))
  );
  return (
    <>
      {routes.length > 10 && (
        <Pagination
          inverted
          totalPages={Math.ceil(routes.length / 10)}
          activePage={activePage + 1}
          onPageChange={(e, { activePage }) => updateActivePage(+activePage - 1)}
        />
      )}
      <Table inverted celled striped collapsing style={{ margin: "auto" }}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan="6" textAlign="center">
              Filters
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Header>
          <Table.Row>
            {tableFilters.map((filter, i) => (
              <Table.HeaderCell key={i}>
                <Select
                  fluid
                  placeholder="Filter by location"
                  options={locOptions}
                  value={filter}
                  onChange={(e, { value }) => changeFilter(i, value)}
                />
              </Table.HeaderCell>
            ))}
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center" colSpan="6">
              Generated Routes
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        {getPage().map((route, idx) => {
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
    </>
  );
};
