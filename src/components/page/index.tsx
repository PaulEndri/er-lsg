import React, { ReactNode, useContext } from "react";
import { Segment, Header, Sidebar, Menu } from "semantic-ui-react";
import { NavContext } from "../../state/nav";
import { SidebarComponent } from "../sidebar";

interface PageProps {
  sidebarItems?: ReactNode;
  title: ReactNode;
  sidebarTitle?: ReactNode;
}

export const PageComponent: React.FC<PageProps> = ({
  sidebarItems,
  title,
  sidebarTitle,
  children,
}) => {
  const { visible } = useContext(NavContext);
  return (
    <div>
      <Sidebar.Pushable style={{ border: 0, padding: 0, margin: 0, width: "150px" }}>
        <Sidebar visible={visible} as={Menu} animation="overlay" inverted vertical>
          <Menu.Header style={{ padding: "10px" }}>
            <Header as="h2" color="black" inverted>
              {sidebarTitle}
            </Header>
          </Menu.Header>
          {sidebarItems}
        </Sidebar>
      </Sidebar.Pushable>
      <Sidebar.Pusher dimmed={visible}>
        <Segment
          inverted
          raised
          color="red"
          textAlign="center"
          padded={false}
          basic
          style={{ marginBottom: 0, padding: 0 }}
        >
          <Header as="h2" style={{ padding: "10px" }}>
            {title}
          </Header>
        </Segment>
        <div
          style={{
            maxHeight: "95vh",
            overflow: "auto",
            overflowX: "hidden",
            minHeight: "85vh",
          }}
        >
          {children}
        </div>
      </Sidebar.Pusher>
    </div>
  );
};
