import { Item, Weapons } from "erbs-sdk";
import React, { useContext, useState, lazy, Suspense, createRef } from "react";
import { Container, Menu, Dimmer, Loader, Grid, Ref, Rail } from "semantic-ui-react";
import { Types } from "../../utilities/types";
import { PageComponent } from "../../components/page";
import { DataContext } from "../../state/data";
import { FilterContext } from "./state";
import { ItemModalContext } from "../../state/itemModal";
import { Route, Switch, useHistory } from "react-router-dom";
import { SidebarContents } from "./children/sidebarContents.component";
import { IS_DESKTOP } from "../../components/isDesktop";
import IsMobile from "../../components/isMobile";
import { MobileLoadoutComponent } from "./children/mobileLoadoutComponent";

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
  const { loadout, character, fetchRoutes } = useContext(DataContext);
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

  const generateRoute = async () => {
    setLoading(true);
    try {
      await fetchRoutes();

      setActiveTab(1);
      history.push("/planner/route");
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const moveToCrafting = () => {
    setLoading(true);
    try {
      setActiveTab(2);
      history.push("/planner/craft");
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const contextRef = createRef() as any;
  return (
    <>
      <PageComponent
        title="Eternal Return: Black Survival Route & Loadout Planner"
        sidebarTitle={IS_DESKTOP ? "" : ""}
        staticMenu={false}
        sidebarItems={null}
      >
        <Ref innerRef={contextRef}>
          <Container fluid>
            <Menu
              className="attached"
              color="red"
              attached="top"
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
                Selection
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
                Generation
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
                Crafting
              </Menu.Item>
            </Menu>
            <Rail position="left">
              <SidebarContents
                loadout={loadout}
                selectedCharacter={character}
                onLoadoutItemClick={onLoadoutItemClick}
                generateRoute={generateRoute}
              />
            </Rail>
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
                    <Grid centered style={{ height: "max-content", marginTop: 0 }}>
                      <SelectionPaneComponent generateRoute={generateRoute} />
                    </Grid>
                  </Route>
                  <Route path={"/planner/selection"} exact>
                    <Grid centered style={{ height: "max-content", marginTop: 0 }}>
                      <SelectionPaneComponent generateRoute={generateRoute} />
                    </Grid>
                  </Route>
                  <Route path="/planner/route" exact>
                    <RoutePaneComponent moveToCrafting={moveToCrafting} />
                  </Route>
                  <Route path="/planner/craft" exact>
                    <RouteCraftingPaneComponent />
                  </Route>
                </Switch>
              </Suspense>
            </Container>
          </Container>
        </Ref>
        <Dimmer active={loading} />
      </PageComponent>
      <IsMobile>
        <div style={{ position: "fixed", bottom: 0, zIndex: 1002, width: "100vw" }}>
          <MobileLoadoutComponent />
        </div>
      </IsMobile>
    </>
  );
};

export default PlannerView;
