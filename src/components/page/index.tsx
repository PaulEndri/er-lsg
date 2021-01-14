import React, { ReactNode, useContext } from "react";
import { Segment, Header, Container, Dimmer } from "semantic-ui-react";
import { NavContext } from "../../state/nav";
import { IS_DESKTOP } from "../isDesktop";
import { SidebarComponent } from "../sidebar";

interface PageProps {
  sidebarItems?: ReactNode;
  title: ReactNode;
  staticMenu?: boolean;
  sidebarTitle?: ReactNode;
}

export const PageComponent: React.FC<PageProps> = ({
  sidebarItems,
  title,
  sidebarTitle,
  staticMenu = false,
  children,
}) => {
  const { visible, toggleVisible } = useContext(NavContext);

  return (
    <div>
      <SidebarComponent staticMenu={staticMenu} title={sidebarTitle}>
        {sidebarItems}
      </SidebarComponent>
      <Segment
        inverted
        raised
        color="red"
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
        <Header as="h2" style={{ padding: "10px" }}>
          {title}
        </Header>
      </Segment>
      <Container fluid>
        <Dimmer active={!staticMenu && visible} onClick={() => toggleVisible()}></Dimmer>

        <div
          style={{
            maxHeight: "95vh",
            overflow: "auto",
            overflowX: "hidden",
            minHeight: "85vh",
            transform: "* 2s",
            marginLeft: (IS_DESKTOP && visible) || staticMenu ? "150px" : "auto",
          }}
        >
          {children}
        </div>
      </Container>
    </div>
  );
};
