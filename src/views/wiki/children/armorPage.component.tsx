import { Armors } from "erbs-sdk";
import React from "react";
import { Container, Menu } from "semantic-ui-react";
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
        inverted={true}
        style={{
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
            seondary
            style={{}}
          >
            {armor}
          </Menu.Item>
        ))}
      </Menu>

      <Container>
        <ItemSearchComponent
          path={`/wiki/armors`}
          items={getList(id)}
          title={`${id || "Armor"} Options`}
        />
      </Container>
    </Container>
  );
};
