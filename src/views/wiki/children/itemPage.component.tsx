import React from "react";
import { Container, Menu } from "semantic-ui-react";
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
        inverted={true}
        style={{
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
          >
            {type}s
          </Menu.Item>
        ))}
      </Menu>

      <Container>
        <ItemSearchComponent
          path={`/wiki/items`}
          items={getMiscList(id)}
          title={`${id || "Item"} Options`}
        />
      </Container>
    </Container>
  );
};
