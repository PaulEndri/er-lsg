import React, { useContext } from "react";
import { Segment } from "semantic-ui-react";
import { DataContext } from "../../../state/data";
import { RouteListComponent } from "./routeList.component";

export const RoutePaneComponent: React.FC<any> = ({ moveToCrafting }) => {
  const { routes, setRoute } = useContext(DataContext);

  return (
    <Segment
      centered
      basic
      style={{
        height: "max-content",
        marginTop: 0,
        padding: 0,

        marginLeft: "3em",
      }}
    >
      <Segment raised basic style={{ borderRadius: 0 }}>
        {!routes && (
          <Segment secondary inverted placeholder textAlign="center" style={{ borderRadius: 0 }}>
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
