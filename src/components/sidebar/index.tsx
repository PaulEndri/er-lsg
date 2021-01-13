import React, { ReactNode, useContext } from "react";
import { Segment, Menu, Header, Sidebar } from "semantic-ui-react";
import { NavContext } from "../../state/nav";
import { IS_MOBILE } from "../isMobile";

interface SidebarProps {
  title: ReactNode;
}
export const SidebarComponent: React.FC<SidebarProps> = ({ title, children }) => {
  const { visible, toggleVisible } = useContext(NavContext);

  if (!title || !children) {
    return null;
  }
  return (
    <Sidebar.Pushable style={{ border: 0, padding: 0, margin: 0, width: "150px" }}>
      <Sidebar visible={visible} as={Menu} animation="overlay" vertical>
        <Menu.Header style={{ padding: "10px" }}>
          <Header as="h2" color="black" inverted>
            {title}
          </Header>
        </Menu.Header>
        {children}
      </Sidebar>
    </Sidebar.Pushable>
  );
};
