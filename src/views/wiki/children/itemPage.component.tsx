import React from "react";
import { Container, Label, Menu } from "semantic-ui-react";
import { useHistory, useParams } from "react-router-dom";
import { getMiscList, MiscListKeys } from "../../../utilities/getList";
import { ItemSearchComponent } from "./ItemSearch.component";

export const ItemPage = () => {
  const history = useHistory();
  const { id } = useParams() as any;

  return (
    <Container fluid>
      <Menu
        className="attached"
        color="red"
        secondary
        inverted
        style={{
          borderRadius: 0,
          marginBottom: 0,
          justifyContent: "center",
        }}
      >
        {MiscListKeys.map((type) => (
          <Menu.Item
            key={type}
            active={id === type}
            onClick={() => {
              history.push(`/wiki/items/${type}`);
            }}
            color="red"
            style={{
              borderRadius: 0,
              paddingLeft: 0,
            }}
          >
            <Label
              style={{ width: "100%", boxShadow: "2px 2px 2px 2px rgba(0,0,0,0.1)" }}
              color="yellow"
              size="large"
            >
              {type}s
            </Label>
          </Menu.Item>
        ))}
      </Menu>

      <ItemSearchComponent
        path={`/wiki/items`}
        items={getMiscList(id)}
        title={`${id || "Item"} Options`}
      />
    </Container>
  );
};
