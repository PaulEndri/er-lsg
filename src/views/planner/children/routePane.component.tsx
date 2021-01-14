import React, { useContext } from "react";
import { Segment } from "semantic-ui-react";
import { DataContext } from "../../../state/data";
import { RouteListComponent } from "./routeList.component";

export const RoutePaneComponent: React.FC<any> = ({ moveToCrafting }) => {
  const { routes, setRoutes, loadout, setRoute } = useContext(DataContext);

  return (
    <Segment
      centered
      style={{ height: "max-content", marginTop: 0, backgroundColor: "rgba(54, 50, 52, 0.5)" }}
    >
      <Segment raised basic style={{}}>
        {!routes && (
          <Segment secondary inverted placeholder textAlign="center">
            No Routes Generated
          </Segment>
        )}
        {routes && (
          <div>
            <RouteListComponent
              setRoute={setRoute}
              moveToCrafting={moveToCrafting}
              root={routes.root}
              routes={routes.routes}
            />
          </div>
        )}
      </Segment>
    </Segment>
  );
};

export default RoutePaneComponent;
