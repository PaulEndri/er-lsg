import React, { useCallback, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Icon, Image, Menu, Segment } from "semantic-ui-react";
import { NavContext } from "../../state/nav";
import { getImageSrc } from "../../utilities/getImageSrc";
import IsDesktop from "../isDesktop";
import IsMobile, { IS_MOBILE } from "../isMobile";
import { SearchComponent } from "./search.component";

const LayoutComponent = ({ children }: any) => {
  const [showPlayValue, updatePlayValue] = useState(false);
  const { toggleVisible, visible } = useContext(NavContext);

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
            </IsDesktop>
            <Menu.Item header as={Link} to="/" floated="right">
              <Image src={getImageSrc("icon")} size="mini" />
              {+visible} Surival Guide
            </Menu.Item>
          </Menu>
        </Segment>

        <Segment basic style={{ padding: 0, margin: 0 }}>
          {children}
        </Segment>
        <Segment color="black" inverted style={{ border: 0 }} basic attached="bottom">
          Lumia Survival Guide and co. are in no way affiliated with Nimble Neuron, Eternal Return:
          Black Survival, or any related entity. For questions and support email the
          <a href="mailto:jrs.abrecan@gmail.com"> the site administrator.</a>
        </Segment>
      </Container>
    </div>
  );
};

export default LayoutComponent;
