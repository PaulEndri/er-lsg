import React, { useState } from "react";
import { Icon, Segment } from "semantic-ui-react";

type Props = {
  title: string;
  toggleCollapse?: any;
  collapsed?: any;
  headerStyle?: any;
  contentStyle?: any;
};
export const SectionComponent: React.FC<Props> = ({
  title,
  collapsed,
  toggleCollapse,
  children,
  headerStyle = {},
  contentStyle = {},
}) => {
  const [localCollapsed, setCollapsed] = useState(false);

  const showContent = toggleCollapse ? collapsed : localCollapsed;
  const clickHandler = toggleCollapse ? toggleCollapse : setCollapsed;
  return (
    <>
      <Segment
        className="fancy-hover"
        color="black"
        basic
        onClick={() => clickHandler(!showContent)}
        inverted={true}
        style={{
          marginBottom: 0,
          border: 0,
          cursor: "pointer",
          borderTop: "2px groove rgba(255, 250, 250, 0.2)",
          ...headerStyle,
        }}
      >
        <Icon name={!showContent ? "plus square outline" : "minus square outline"} />
        <h3 className="header inverted={true}" style={{ display: "inline", paddingLeft: "8px" }}>
          {title}
        </h3>
      </Segment>
      <div
        style={{
          backgroundColor: "rgba(70, 66, 66, 0.6)",
          paddingTop: "1rem",
          textAlign: "center",
          display: showContent ? "block" : "none",
          ...contentStyle,
        }}
      >
        {children}
      </div>
    </>
  );
};
