import React from "react";
import { Segment, Header, Button, Label, Icon, Item as SemItem, Image } from "semantic-ui-react";
import { getImageSrc } from "../../../utilities/getImageSrc";
import { Item, Items, Location, Locations, RouteNode, MaterialList } from "erbs-sdk";
import { useHistory } from "react-router-dom";

type Props = {
  root: RouteNode;
  setRoute: (routes) => null;
  routes: RouteNode[];
};

export const RouteListComponent: React.FC<Props> = ({ root, setRoute, routes }) => {
  const history = useHistory();

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
    history.push("/planner/craft");
  };

  return (
    <SemItem.Group style={{ padding: 0 }}>
      {routes.slice(0, 20).map((route, idx) => (
        <SemItem
          style={{
            backgroundColor: "rgba(129, 128, 127, 0.2)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0px 0px 2px 2px rgba(29, 28, 27, 0.3)",
          }}
        >
          {route.traversed.map((location, locIndex) => {
            let traversedRoot = root;

            route.traversed.slice(0, locIndex + 1).forEach((loc) => {
              traversedRoot = traversedRoot.next[loc];
            });

            return (
              <div
                key={locIndex}
                style={{ borderRight: "1px solid rgba(255, 255, 255, 0.5)", width: "150px" }}
              >
                <Label
                  color="yellow"
                  style={{
                    display: "block",
                    borderRadius: 0,
                    paddingRight: 0,
                    paddingLeft: 0,
                    marginBottom: "4px",
                  }}
                >
                  {Locations[location]}
                </Label>
                <div style={{ textAlign: "center" }}>
                  {traversedRoot.completed.map((id) => (
                    <Image
                      inline
                      centered
                      src={getImageSrc(Items[id].replace(/([A-Z])/g, " $1").trim())}
                      width={50}
                      height={30}
                      circular
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.2)", margin: "4px" }}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          <Button
            compact
            color="green"
            onClick={() => handleClick(route)}
            attached="right"
            style={{ borderRadius: 0, display: "flex" }}
          >
            <div style={{ textAlign: "center", alignSelf: "center" }}>
              See Route Details
              <br />
              <Icon size="large" name="chevron circle right" style={{ marginTop: "12px" }} />
            </div>
          </Button>
        </SemItem>
      ))}
    </SemItem.Group>
  );
};
