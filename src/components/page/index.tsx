import React, { ReactNode, useContext } from "react";
import { Segment, Header, Container, Dimmer, Menu } from "semantic-ui-react";
import { NavContext } from "../../state/nav";
import IsDesktop, { IS_DESKTOP } from "../isDesktop";
import { IS_MOBILE } from "../isMobile";
import { SidebarComponent } from "./sidebar.component";

interface PageProps {
  sidebarItems?: ReactNode;
  title: ReactNode;
  subMenu?: ReactNode;
  fluid?: boolean;
  staticMenu?: boolean;
  sidebarTitle?: ReactNode;
}

export const PageComponent: React.FC<PageProps> = ({
  sidebarItems,
  title,
  sidebarTitle,
  subMenu,
  staticMenu = false,
  fluid,
  children,
}) => {
  const { visible, toggleVisible } = useContext(NavContext);

  const divStyle = IS_DESKTOP
    ? {
        transform: "* 2s",
        marginLeft: visible || staticMenu ? "150px" : "auto",
      }
    : {
        overflowY: "hidden",
      };
  return (
    <div>
      <SidebarComponent staticMenu={staticMenu} title={sidebarTitle}>
        {sidebarItems}
      </SidebarComponent>
      {!sidebarItems || IS_MOBILE ? (
        <Segment
          inverted={true}
          raised
          color="teal"
          textAlign="center"
          padded={false}
          basic
          style={{
            marginBottom: 0,
            padding: 0,
            marginTop: 0,

            marginLeft: (IS_DESKTOP && visible) || staticMenu ? "150px" : "auto",
          }}
          onPressOut
        >
          <Header style={{ padding: "10px" }}>{title}</Header>
        </Segment>
      ) : null}
      {sidebarItems && (
        <IsDesktop>
          <Segment
            inverted={true}
            raised
            color="grey"
            textAlign="center"
            padded={false}
            basic
            style={{
              marginBottom: 0,
              padding: 0,

              marginTop: 0,
              marginLeft: (IS_DESKTOP && visible) || staticMenu ? "150px" : "auto",
            }}
            onPressOut
          >
            <Menu style={{ justifyContent: "center" }} color="teal" inverted={true}>
              {sidebarItems}
            </Menu>
          </Segment>
          {subMenu}
        </IsDesktop>
      )}
      <Container
        style={{
          minHeight: "80vh",
        }}
        fluid={fluid}
      >
        <Dimmer active={!staticMenu && visible} onClick={() => toggleVisible()}></Dimmer>

        <div style={divStyle as any}>{children}</div>
      </Container>
    </div>
  );
};
