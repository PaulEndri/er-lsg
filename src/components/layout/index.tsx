import React, { useCallback, useContext, useState } from "react";
import { Link } from "react-router-dom";
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

  const el = useCallback(() => {
    const el = window.document.getElementById("SHOW_PLAYER_SEARCH");

    if (el) {
      updatePlayValue(el.getAttribute("data-enabled") === "true");
    }
  }, []);

  return (
    <div ref={el}>
      <Container fluid style={{ margin: "0px" }}>
        <Segment
          inverted
          style={{
            marginBottom: 0,
            borderRadius: 0,
            padding: 0,
          }}
          raised={true}
        >
          <Menu inverted>
            <Menu.Item onClick={() => toggleVisible()}>
              <Icon name="bars"></Icon>
            </Menu.Item>
            <IsDesktop>
              <Menu.Item header as={Link} to="/">
                <Image src={getImageSrc("icon")} size="mini" />
                Surival Guide
              </Menu.Item>
              <Menu.Item as={Link} to="/" exact>
                Home
              </Menu.Item>
              <Menu.Item as={Link} to="/wiki/*">
                Wiki
              </Menu.Item>
              <Menu.Item as={Link} to="/planner">
                Planner
              </Menu.Item>
              <Menu.Item as={Link} to="/about">
                About
              </Menu.Item>
              {showPlayValue && <SearchComponent />}
              <Menu.Item position="right">
                <span style={{ marginLeft: "1em" }}>{user && "Welcome Back!"}</span>
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
        <Segment color="black" inverted basic attached="bottom" size="tiny">
          Lumia Survival Guide and co. are in no way affiliated with Nimble Neuron, Eternal Return:
          Black Survival, or any related entity. For questions and support email the
          <a href="mailto:jrs.abrecan@gmail.com"> the site administrator.</a>
        </Segment>
      </Container>
    </div>
  );
};

export default LayoutComponent;
