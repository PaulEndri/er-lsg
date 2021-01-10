import { Categories, Item, Loadout, Weapons, WeaponsLookup, Route as LoadoutRoute } from "erbs-sdk";
import React, { PureComponent, useContext, useState } from "react";
import {
  Card,
  Image,
  List,
  Label,
  Grid,
  Container,
  Header,
  Tab,
  Menu,
  Dimmer,
} from "semantic-ui-react";
import { SelectionPaneComponent } from "./children/selectionPane.component";
import { RoutePaneComponent } from "./children/routePane.component";
import { Types } from "../../utilities/types";
import { PageComponent } from "../../components/page";
import { getImageSrc } from "../../utilities/getImageSrc";
import { LoadoutContext } from "../../state/loadout";
import { FilterContext, FilterProvider } from "./state";
import { ItemModalContext } from "../../state/itemModal";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import { SidebarContents } from "./children/sidebarContents.component";
import { RouteCraftingComponent } from "./children/routeCrafting.component";

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
  const { loadout, character, updateCharacter, setRoutes } = useContext(LoadoutContext);
  const { setItem } = useContext(ItemModalContext);
  const { massUpdate, filterStates, toggle } = useContext(FilterContext);
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
            Routes Generation
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
              <RouteCraftingComponent />
            </Route>
          </Switch>
        </Container>
      </Container>
      <Dimmer active={loading} />
    </PageComponent>
  );
};

// wp ch hea arm leg acc

// q w e r d p

export default PlannerView;
