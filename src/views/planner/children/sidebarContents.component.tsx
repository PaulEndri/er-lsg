import React from "react";
import { Button, Segment, Menu } from "semantic-ui-react";
import { LoadOutItemComponent } from "./loadOutItem.component";
import { CharacterPortrait } from "../../../components/characterPortrait.component";
import { loadoutMenu } from "../index";

export const SidebarContents = ({
  selectedCharacter,
  loadout,
  onLoadoutItemClick,
  generateRoute,
}) => (
  <React.Fragment>
    <Segment
      raised
      inverted
      secondary
      color="black"
      textAlign="center"
      placeholder={!selectedCharacter}
      style={{ borderRadius: 0 }}
    >
      {selectedCharacter && (
        <CharacterPortrait width={120} type="mini" name={selectedCharacter.name} />
      )}
      {!selectedCharacter && <div style={{ maxWidth: "120px" }}>No Character Selected</div>}
    </Segment>
    {loadoutMenu.map((type) => (
      <LoadOutItemComponent
        key={type}
        type={type}
        item={loadout[type]}
        onClick={onLoadoutItemClick}
      />
    ))}
    <Menu.Item
      style={{
        borderRadius: "0px",
      }}
    >
      <Button onClick={() => generateRoute()} color="green" style={{ borderRadius: "0px" }} fluid>
        Generate Routes
      </Button>
    </Menu.Item>
  </React.Fragment>
);
