import React, { ReactNode, useContext } from "react";
import { Link } from "react-router-dom";
import { Menu, Header } from "semantic-ui-react";
import { NavContext } from "../../state/nav";
import IsMobile from "../isMobile";

interface SidebarProps {
  title: ReactNode;
  staticMenu?: boolean;
}
export const SidebarComponent: React.FC<SidebarProps> = ({
  title,
  children,
  staticMenu = false,
}) => {
  const { visible } = useContext(NavContext);

  if (!title || !children) {
    return null;
  }
  return (
    <Menu
      style={{
        display: visible || staticMenu ? "block" : "none",
        borderRadius: 0,
        height: "100%",
        position: "absolute",
        zIndex: 1001,
      }}
      animation="overlay"
      inverted
      vertical
    >
      <IsMobile>
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
      </IsMobile>
      <Menu.Header style={{ padding: "10px" }}>
        <Header as="h2" color="black" inverted>
          {title}
        </Header>
      </Menu.Header>
      {children}
    </Menu>
  );
};
