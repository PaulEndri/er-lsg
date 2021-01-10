import React, { FunctionComponent } from "react";
import { Button, Segment, Header } from "semantic-ui-react";
import { LoadOutItemComponent } from "./loadOutItem.component";
import { ICharacter, Loadout } from "erbs-sdk";
import { Types } from "../../../utilities/types";
import { getImageSrc } from "../../../utilities/getImageSrc";

export interface LoadoutProps {
  loadout: Loadout;
  selectedCharacter: ICharacter;
  onLoadoutItemClick: any;
}

export const DesktopLoadoutComponent: FunctionComponent<LoadoutProps> = ({
  loadout,
  selectedCharacter,
  onLoadoutItemClick,
}) => (
  <Segment
    basic
    floated="left"
    inverted
    color="black"
    style={{ minHeight: "95vh", marginTop: 0, marginRight: 0, padding: 0 }}
  >
    <Segment.Group inverted basic style={{ border: 0, borderRadius: 0 }}>
      <Segment basic inverted style={{ borderRadius: 0, padding: 0, margin: 0 }}>
        <Header as="h2" style={{ padding: "10px" }}>
          Loadout
        </Header>
      </Segment>
      <Segment
        raised
        inverted
        secondary
        color="black"
        textAlign="center"
        placeholder={!selectedCharacter}
        style={{ minHeight: "166px" }}
      >
        {selectedCharacter && (
          <div
            style={{
              backgroundColor: "rgba(66, 64, 74, 0.5)",
              border: "1px solid rgba(125, 125, 125, 0.1)",
              boxShadow: "0 1px 2px 0 rgba(34,36,38,.15)",
            }}
          >
            <img src={getImageSrc(`characters/mini/${selectedCharacter.name}`)} />
          </div>
        )}
        {!selectedCharacter && <div style={{ maxWidth: "120px" }}>No Character Selected</div>}
      </Segment>
      <Segment inverted style={{ padding: 0 }}>
        <LoadOutItemComponent
          item={loadout.Weapon}
          type={Types.Weapon}
          onClick={onLoadoutItemClick}
        />
      </Segment>
      <Segment raised inverted secondary color="black" style={{ padding: 0 }}>
        <LoadOutItemComponent
          item={loadout.Chest}
          type={Types.Chest}
          onClick={onLoadoutItemClick}
        />
      </Segment>
      <Segment basic inverted secondary color="black" style={{ padding: 0 }}>
        <LoadOutItemComponent item={loadout.Head} type={Types.Head} onClick={onLoadoutItemClick} />
      </Segment>
      <Segment basic inverted tertiary color="black" style={{ padding: 0 }}>
        <LoadOutItemComponent item={loadout.Arm} type={Types.Arm} onClick={onLoadoutItemClick} />
      </Segment>
      <Segment basic inverted secondary color="black" style={{ padding: 0 }}>
        <LoadOutItemComponent item={loadout.Leg} type={Types.Leg} onClick={onLoadoutItemClick} />
      </Segment>
      <Segment basic inverted secondary color="black" style={{ padding: 0 }}>
        <LoadOutItemComponent
          item={loadout.Accessory}
          type={Types.Accessory}
          onClick={onLoadoutItemClick}
        />
      </Segment>
      <Segment inverted textAlign="center" color="black">
        <Button
          color="red"
          style={{ borderRadius: "0" }}
          fluid
          onClick={() => onLoadoutItemClick()}
        >
          Clear All
        </Button>
      </Segment>
    </Segment.Group>
  </Segment>
);
