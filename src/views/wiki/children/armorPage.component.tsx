import { Armors } from "erbs-sdk";
import React from "react";
import { Container, Label, Menu } from "semantic-ui-react";
import { useHistory, useParams } from "react-router-dom";
import { getList } from "../../../utilities/getList";
import { ItemSearchComponent } from "./ItemSearch.component";

export const ArmorPage = () => {
  const history = useHistory();
  const { id } = useParams() as any;

  return (
    <Container fluid>
      <Menu
        className="attached"
        color="red"
        inverted
        secondary
        style={{
          borderRadius: 0,
          marginBottom: 0,
          justifyContent: "center",
        }}
      >
        {Object.keys(Armors).map((armor) => (
          <Menu.Item
            key={armor}
            active={id === armor}
            onClick={() => {
              history.push(`/wiki/armors/${armor}`);
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
              {armor}
            </Label>
          </Menu.Item>
        ))}
      </Menu>

      <ItemSearchComponent
        path={`/wiki/armors`}
        items={getList(id)}
        title={`${id || "Armor"} Options`}
      />
    </Container>
  );
};
