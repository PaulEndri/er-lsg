import React, { useCallback, useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Container, Icon, Image, Menu, Segment } from "semantic-ui-react";
import { NavContext } from "../../state/nav";
import { getImageSrc } from "../../utilities/getImageSrc";
import IsDesktop from "../isDesktop";
import IsMobile from "../isMobile";
import { SearchComponent } from "./search.component";
import * as NetlifyIdentityWidget from "netlify-identity-widget";
import { DataContext } from "../../state/data";

const LayoutComponent = ({ children }: any) => {
  const [showPlayValue, updatePlayValue] = useState(false);
  const { toggleVisible } = useContext(NavContext);
  const { user } = useContext(DataContext);
  const location = useLocation();

  const el = useCallback(() => {
    const el = window.document.getElementById("SHOW_PLAYER_SEARCH");

    if (el) {
      updatePlayValue(el.getAttribute("data-enabled") === "true");
    }
  }, []);

  const menuItems = ["home", "wiki", "planner", "about"];
  return (
    <div ref={el}>
      <Container fluid style={{ margin: "0px" }}>
        <Segment
          inverted
          style={{
            marginBottom: 0,

            padding: 0,
          }}
          raised={true}
        >
          <Menu inverted>
            <IsMobile>
              <Menu.Item onClick={() => toggleVisible()}>
                <Icon name="bars"></Icon>
              </Menu.Item>
            </IsMobile>
            <IsDesktop>
              <Menu.Item header as={Link} to="/">
                <Image src={getImageSrc("icon")} size="mini" />
                Surival Guide
              </Menu.Item>
              {menuItems.map((item) => (
                <Menu.Item
                  key={item}
                  as={Link}
                  to={item === "home" ? "/" : `/${item}`}
                  color={
                    item === "home"
                      ? location.pathname === "/"
                        ? "teal"
                        : null
                      : location.pathname.includes(item)
                      ? "teal"
                      : null
                  }
                  active={
                    item === "home" ? location.pathname === "/" : location.pathname.includes(item)
                  }
                  exact={item === "home"}
                  style={{ textTransform: "capitalize" }}
                >
                  {item === "planner" ? "Routes" : item}
                </Menu.Item>
              ))}
              {showPlayValue && <SearchComponent />}
              <Menu.Item position="right">
                <span style={{ marginRight: "1em" }}>{user && "Welcome Back!"}</span>
                <Button
                  color="brown"
                  style={{ borderRadius: 0 }}
                  onClick={() => {
                    if (user) {
                      NetlifyIdentityWidget.logout();
                    } else {
                      NetlifyIdentityWidget.open();
                    }
                  }}
                >
                  <Icon name={user ? "user cancel" : "user"} />
                  Log {user ? "Out" : "In"}
                </Button>
              </Menu.Item>
            </IsDesktop>
            <IsMobile>
              <Menu.Item header as={Link} to="/" position="right">
                <Image src={getImageSrc("icon")} size="mini" />
                Surival Guide
              </Menu.Item>
            </IsMobile>
          </Menu>
        </Segment>

        <Segment basic style={{ padding: 0, margin: 0 }}>
          {children}
        </Segment>
      </Container>
      <Segment color="black" inverted basic size="tiny">
        Lumia Survival Guide and co. are in no way affiliated with Nimble Neuron, Eternal Return:
        Black Survival, or any related entity. For questions and support email the
        <a href="mailto:jrs.abrecan@gmail.com"> the site administrator.</a>
      </Segment>
    </div>
  );
};

export default LayoutComponent;
