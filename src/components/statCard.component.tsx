import React from "react";
import { Header, Segment } from "semantic-ui-react";

type Props = {
  style?: any;
  title: string;
  textAlign?: "center" | "left" | "right";
  subtitle?: string;
};

export const StatCardComponent: React.FC<Props> = ({
  children,
  style,
  textAlign = "left",
  title,
  subtitle,
}) => (
  <Segment
    basic
    textAlign={textAlign}
    inverted
    style={{
      background: "rgba(55, 54, 54, 1)",
      border: "2px inset rgba(200, 200, 200, 0.2)",
      padding: 0,
      display: "flex",
      flexFlow: "column",
      boxShadow: "2px 2px 2px 0px rgba(255, 255, 255, 0.1)",
      ...style,
    }}
  >
    <div
      style={{
        width: "100%",
        background: "rgba(255, 255, 255, 0.8)",
        padding: 10,
        borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
      }}
    >
      <Header color="black" size="large" style={{}} content={title} subheader={subtitle} />
    </div>
    <div style={{ padding: 10 }}>{children}</div>
  </Segment>
);
