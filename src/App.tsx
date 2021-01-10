import React from "react";
import "./App.css";
import "semantic-ui-css/semantic.min.css";
import LayoutComponent from "./components/layout";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PlannerView from "./views/planner";
import { ItemModalProvider } from "./state/itemModal";
import { ItemModalComponent } from "./components/itemModal.component";
import WikiView from "./views/wiki";
import { LoadoutProvider } from "./state/loadout";
import { BG_THIRD } from "./utilities/bgImages";
import PlayerView from "./views/players";
import { FilterProvider } from "./views/planner/state";
import HomeView from "./views/home";

function App() {
  return (
    <div className="App" style={{ backgroundImage: BG_THIRD, minHeight: "100vh" }}>
      <LoadoutProvider>
        <ItemModalProvider>
          <Router>
            <LayoutComponent>
              <Switch>
                <Route exact path="/">
                  <HomeView />
                </Route>
                <Route path="/planner">
                  <FilterProvider>
                    <PlannerView />
                  </FilterProvider>
                </Route>
                <Route path="/wiki">
                  <WikiView />
                </Route>
                <Route path="/players">
                  <PlayerView />
                </Route>
              </Switch>
            </LayoutComponent>

            <ItemModalComponent />
          </Router>
        </ItemModalProvider>
      </LoadoutProvider>
    </div>
  );
}

export default App;
