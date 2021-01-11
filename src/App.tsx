import React, { Suspense, lazy } from "react";
import "./App.css";
import "semantic-ui-css/semantic.min.css";
import LayoutComponent from "./components/layout";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ItemModalProvider } from "./state/itemModal";
import { ItemModalComponent } from "./components/itemModal.component";
import { DataProvider } from "./state/data";
import { BG_THIRD } from "./utilities/bgImages";
import { FilterProvider } from "./views/planner/state";
import HomeView from "./views/home";
import { Dimmer, Loader } from "semantic-ui-react";

const WikiView = lazy(() => import("./views/wiki"));
const PlayerView = lazy(() => import("./views/players"));
const PlannerView = lazy(() => import("./views/planner"));

function App() {
  return (
    <div className="App" style={{ backgroundImage: BG_THIRD, minHeight: "100vh" }}>
      <DataProvider>
        <ItemModalProvider>
          <Router>
            <LayoutComponent>
              <Suspense
                fallback={
                  <Dimmer active>
                    <Loader />
                  </Dimmer>
                }
              >
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
              </Suspense>
            </LayoutComponent>

            <ItemModalComponent />
          </Router>
        </ItemModalProvider>
      </DataProvider>
    </div>
  );
}

export default App;
