import { Armors, Character, Locations, Weapons } from "erbs-sdk";
import React, { useState } from "react";
import { Menu, Grid, Label, Header, Image, Button } from "semantic-ui-react";
import { Link, Route, Switch, useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { PageComponent } from "../../components/page";
import { CharacterLandingPage, CharacterPage } from "./children/characterPage.component";
import { WeaponPage } from "./children/weaponPage.component";
import { ArmorPage } from "./children/armorPage.component";
import { ItemPage } from "./children/itemPage.component";
import { LocationLandingPage, LocationPage } from "./children/locationPage.component";
import CharacterThumbnailComponent from "../../components/characterThumbnail.component";
import { getImageSrc } from "../../utilities/getImageSrc";
import { BG_THIRD } from "../../utilities/bgImages";
import { MapComponent } from "../../components/map/index";
import { AnimalLandingPage, AnimalPage } from "./children/animalPage.component";
import { MiscListKeys } from "../../utilities/getList";

const menuItems = [
  ["characters", "Characters", Object.keys(Character.SOURCES)],
  ["weapons", "Weapons", Object.keys(Weapons)],
  ["armors", "Armors", Object.keys(Armors)],
  ["locations", "Locations", Object.keys(Locations).filter((type) => !isNaN(Locations[type]))],
  ["items", "Items", MiscListKeys],
  ["animals", "Animals"],
];

export const initialLoadout = {
  Weapon: null,
  Chest: null,
  Head: null,
  Arm: null,
  Leg: null,
  Accessory: null,
};

const HpHeader = ({ content, path }) => {
  const [hovering, setHovering] = useState(false);
  const history = useHistory();

  const color = hovering ? "rgba(251, 189, 8, 1)" : "rgba(200, 200, 200, 0.2)";
  const background = hovering
    ? "linear-gradient(360deg,rgba(252,205,51,.5214460784313726) 0%,rgba(51,51,51,.1825105042016807) 22%)"
    : null;
  return (
    <div
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={() => history.push(`/wiki/${path}`)}
      style={{
        paddingTop: "1rem",
        background,
        paddingLeft: "20px",
        paddingBottom: "5px",
        marginBottom: "1rem",
        width: "100%",
        borderBottom: `2px inset ${color}`,
      }}
    >
      <Header size="large" inverted>
        {content}
      </Header>
    </div>
  );
};
const WikiView = () => {
  const location = useLocation();
  const { path } = useRouteMatch();
  const history = useHistory();

  const sidebarItems = menuItems.map(([route, name, subMenuItems]: [string, string, string[]]) => {
    const isActive = location.pathname.includes(route);
    const path = `/wiki/${route}`;
    const isRoot = location.pathname === path;
    const showSubMenu = isActive && !isRoot && subMenuItems && subMenuItems.length > 0;

    return (
      <Menu.Item key={route} active={isActive} as={Link} to={path} className="fancy-hover">
        {name}
        {showSubMenu && (
          <Menu.Menu>
            {subMenuItems.map((subRoute) => (
              <Menu.Item
                name={subRoute}
                key={subRoute + route}
                as={Link}
                to={`${path}/${subRoute}`}
              />
            ))}
          </Menu.Menu>
        )}
      </Menu.Item>
    );
  });
  return (
    <PageComponent
      sidebarTitle="Information"
      sidebarItems={sidebarItems}
      title="Lumia Island Information Center"
    >
      <Switch>
        <Route path={`${path}/characters/:id`}>
          <CharacterPage />
        </Route>
        <Route exact path={`${path}/characters`}>
          <CharacterLandingPage />
        </Route>
        <Route exact path={`${path}/weapons`}>
          <WeaponPage />
        </Route>
        <Route path={`${path}/weapons/:id`}>
          <WeaponPage />
        </Route>
        <Route exact path={`${path}/armors`}>
          <ArmorPage />
        </Route>
        <Route path={`${path}/armors/:id`}>
          <ArmorPage />
        </Route>
        <Route exact path={`${path}/items`}>
          <ItemPage />
        </Route>
        <Route path={`${path}/items/:id`}>
          <ItemPage />
        </Route>
        <Route exact path={`${path}/locations`}>
          <LocationLandingPage />
        </Route>
        <Route path={`${path}/locations/:id`}>
          <LocationPage />
        </Route>
        <Route exact path={`${path}/animals`}>
          <AnimalLandingPage />
        </Route>
        <Route path={`${path}/animals/:id`}>
          <AnimalPage />
        </Route>
        <Route path="" exact>
          <Grid
            centered
            style={{
              backgroundColor: "rgba(50, 50, 50, 0.9)",
              backgroundImage: BG_THIRD,
              backgroundPosition: "5px 25px",
            }}
          >
            <Grid.Row textAlign="center" centered>
              <Grid.Column width={3}>
                <Image size="medium" src={getImageSrc("logo")} centered />
              </Grid.Column>
              <Grid.Column width={3} verticalAlign="middle">
                <Header size="huge" inverted>
                  Survival Guide
                </Header>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row style={{ margin: 0, padding: 0 }}></Grid.Row>
            <Grid.Row style={{ marginTop: "2rem" }}>
              <Grid.Column width={4}>
                <div>
                  <HpHeader content={"Test Subjects"} path={"characters"} />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                      justifyContent: "center",
                    }}
                  >
                    {(menuItems[0][2] as string[]).map((char) => (
                      <CharacterThumbnailComponent
                        key={char}
                        isActive={false}
                        onClick={() => history.push(`/wiki/characters/${char}`)}
                        name={char}
                      />
                    ))}
                  </div>
                </div>
              </Grid.Column>
              <Grid.Column width={8} style={{ paddingLeft: "0" }}>
                <Grid style={{ borderLeft: "3px groove rgba(200, 200 , 200, 0.2)" }}>
                  <Grid.Row basic fluid>
                    <HpHeader content="Weapon Types" path={"weapons"} />
                  </Grid.Row>
                  <Grid.Row>
                    <div style={{ paddingLeft: "1rem" }}>
                      {Object.values(Weapons).map((wpn) => (
                        <Button
                          key={wpn}
                          color="grey"
                          style={{
                            borderRadius: 0,
                            marginRight: 0,
                            marginLeft: 0,
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                          }}
                          compact
                          onClick={() => history.push(`/wiki/weapons/${wpn}`)}
                        >
                          <Image
                            wrapped
                            size="small"
                            style={{
                              maxHeight: "auto",
                              width: "50px",
                            }}
                            src={getImageSrc(`Weapon${wpn}`)}
                          />
                        </Button>
                      ))}
                    </div>
                  </Grid.Row>
                  <Grid.Row basic>
                    <HpHeader content="Armors & Items" path={"items"} />
                  </Grid.Row>
                  <Grid.Row>
                    <div style={{ paddingLeft: "1rem" }}>
                      {(menuItems[2][2] as string[]).map((char) => (
                        <Label
                          size="large"
                          color="orange"
                          style={{ margin: 4 }}
                          key={char}
                          icon="user"
                          as={Link}
                          to={`/wiki/armors/${char}`}
                        >
                          {char}
                        </Label>
                      ))}
                      {(menuItems[4][2] as string[]).map((char) => (
                        <Label
                          size="large"
                          color="orange"
                          style={{ margin: 4 }}
                          key={char}
                          icon="user"
                          as={Link}
                          to={`/wiki/items/${char}`}
                        >
                          {char}
                        </Label>
                      ))}
                    </div>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row basic style={{ borderRadius: 0 }}>
              <HpHeader content="Lumia Island" path={"locations"} />
              <div style={{ paddingLeft: "1rem", display: "flex", flexFlow: "row wrap" }}>
                <MapComponent onClick={(e) => history.push(`/wiki/locations/${e}`)} />
              </div>
            </Grid.Row>
          </Grid>
        </Route>
      </Switch>
    </PageComponent>
  );
};

export default WikiView;
