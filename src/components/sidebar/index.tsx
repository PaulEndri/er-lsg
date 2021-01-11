import React, { ReactNode } from "react";
import { Segment, Menu, Header } from "semantic-ui-react";

interface SidebarProps {
  title: ReactNode;
}
export const SidebarComponent: React.FC<SidebarProps> = ({ title, children }) => {
  return (
    <Segment
      basic
      compact
      inverted
      floated="left"
      textAlign="left"
      color="black"
      style={{
        border: 0,
        borderRadius: 0,
        marginTop: 0,
        minHeight: "95vh",
        padding: 0,
        marginRight: 0,
        width: "150px",
        height: "max-content",
      }}
    >
      <Menu inverted vertical style={{ border: 0, borderRadius: 0 }} fluid color="black">
        <Menu.Header style={{ padding: "10px" }}>
          <Header as="h2" color="black" inverted>
            {title}
          </Header>
        </Menu.Header>
        {children}
      </Menu>
    </Segment>
  );
};
