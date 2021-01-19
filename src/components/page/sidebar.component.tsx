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
  const { visible, toggleVisible } = useContext(NavContext);

  return (
    <Menu
      style={{
        display: visible || staticMenu ? "block" : "none",

        height: "100%",
        position: "absolute",
        zIndex: 1001,
        maxWidth: "150px",
      }}
      animation="overlay"
      inverted={true}
      vertical
    >
      <IsMobile>
        <Menu.Item onClick={() => toggleVisible()} as={Link} to="/" exact>
          Home
        </Menu.Item>
        <Menu.Item onClick={() => toggleVisible()} as={Link} to="/wiki/*">
          Wiki
        </Menu.Item>
        <Menu.Item onClick={() => toggleVisible()} as={Link} to="/planner">
          Planner
        </Menu.Item>
        <Menu.Item onClick={() => toggleVisible()} as={Link} to="/about">
          About
        </Menu.Item>
      </IsMobile>
      <Menu.Header style={{ padding: "10px" }}>
        <Header as="h2" color="black" inverted={true}>
          {title}
        </Header>
      </Menu.Header>
      {children}
    </Menu>
  );
};
