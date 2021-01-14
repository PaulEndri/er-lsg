import { Item, Weapons, Route as LoadoutRoute } from "erbs-sdk";
import React, { useContext, useState, lazy, Suspense } from "react";
import { Container, Menu, Dimmer, Loader } from "semantic-ui-react";

import { Types } from "../../utilities/types";
import { PageComponent } from "../../components/page";
import { DataContext } from "../../state/data";
import { FilterContext } from "./state";
import { ItemModalContext } from "../../state/itemModal";
import { Route, Switch, useHistory } from "react-router-dom";
import { SidebarContents } from "./children/sidebarContents.component";

const RouteCraftingPaneComponent = lazy(() => import("./children/routeCraftingPane.component"));
const SelectionPaneComponent = lazy(() => import("./children/selectionPane.component"));
const RoutePaneComponent = lazy(() => import("./children/routePane.component"));

export const initialLoadout = {
  Weapon: null,
  Chest: null,
  Head: null,
  Arm: null,
  Leg: null,
  Accessory: null,
};

export const loadoutMenu = [
  Types.Weapon,
  Types.Chest,
  Types.Head,
  Types.Arm,
  Types.Leg,
  Types.Accessory,
];

const PlannerView = () => {
  const { loadout, character, setRoutes } = useContext(DataContext);
  const { setItem } = useContext(ItemModalContext);
  const { massUpdate } = useContext(FilterContext);
  const [activeTab, setActiveTab] = useState(
    window.location.pathname.includes("/route")
      ? 1
      : window.location.pathname.includes("/craft")
      ? 2
      : 0
  );
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const onLoadoutItemClick = (item: Item<string>, type) => {
    setActiveTab(0);
    history.push("/planner/selection");

    if (item) {
      setItem(item);
    } else if (type) {
      let _type = Object.keys(Weapons).includes(type) ? Types.Weapon : type;

      const vals = Object.fromEntries(Object.keys(Types).map((key: any) => [key, key === _type]));
      massUpdate(vals);
    }
  };

  const generateRoute = () => {
    setLoading(true);
    try {
      const route = new LoadoutRoute(loadout);
      setRoutes(route.generate());

      setActiveTab(2);
      history.push("/planner/route");
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageComponent
      title="Eternal Return: Black Survival Route & Loadout Planner"
      sidebarTitle="Loadout"
      staticMenu={true}
      sidebarItems={
        <SidebarContents
          loadout={loadout}
          selectedCharacter={character}
          onLoadoutItemClick={onLoadoutItemClick}
          generateRoute={generateRoute}
        />
      }
    >
      <Container fluid>
        <Menu
          className="attached"
          color="red"
          inverted
          style={{
            borderRadius: 0,
            marginBottom: 0,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Menu.Item
            active={activeTab === 0}
            onClick={() => {
              setActiveTab(0);
              history.push(`/planner/selection`);
            }}
            color="red"
            style={{
              borderRadius: 0,
            }}
          >
            Equipment Selection
          </Menu.Item>
          <Menu.Item
            active={activeTab === 1}
            onClick={() => {
              setActiveTab(1);
              history.push(`/planner/route`);
            }}
            color="red"
            style={{
              borderRadius: 0,
            }}
          >
            Route Generation
          </Menu.Item>
          <Menu.Item
            active={activeTab === 2}
            onClick={() => {
              setActiveTab(2);
              history.push(`/planner/craft`);
            }}
            color="red"
            style={{
              borderRadius: 0,
            }}
          >
            Route Crafting
          </Menu.Item>
        </Menu>
        <Container fluid>
          <Suspense
            fallback={
              <Dimmer active>
                <Loader />
              </Dimmer>
            }
          >
            <Switch>
              <Route path={"/planner"} exact>
                <SelectionPaneComponent />
              </Route>
              <Route path={"/planner/selection"} exact>
                <SelectionPaneComponent />
              </Route>
              <Route path="/planner/route" exact>
                <RoutePaneComponent />
              </Route>
              <Route path="/planner/craft" exact>
                <RouteCraftingPaneComponent />
              </Route>
            </Switch>
          </Suspense>
        </Container>
      </Container>
      <Dimmer active={loading} />
    </PageComponent>
  );
};

export default PlannerView;
