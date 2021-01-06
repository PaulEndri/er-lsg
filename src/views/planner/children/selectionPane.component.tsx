import React, { useContext } from "react";
import { Grid } from "semantic-ui-react";
import { getItemList } from "../../../utilities/getList";
import { Characters, Item } from "erbs-sdk";
import { Types } from "../../../utilities/types";
import { ItemModalButton } from "../../../components/itemModalButton.component";
import { SectionComponent } from "../../../components/section.component";
import { FilterContext } from "../state";
import CharacterThumbnailComponent from "../../../components/characterThumbnail.component";

type Props = {
  selectedCharacter: any;
  toggle: any;
  updateCharacter: any;
  filterStates: Record<Types, boolean>;
};

export const SelectionPaneComponent: React.FC<Props> = ({
  filterStates,
  toggle,
  selectedCharacter,
  updateCharacter,
}) => {
  const getTypeValue = (type) =>
    type === Types.Weapon && selectedCharacter
      ? selectedCharacter.weapons.map((wpn) => getItemList(wpn)).flat()
      : getItemList(type);

  return (
    <Grid centered>
      <Grid.Row>
        <Grid.Column width={9}>
          <SectionComponent title="Test Subject Selection">
            <div
              style={{
                display: "flex",
                flexFlow: "row wrap",
                justifyContent: "center",
              }}
            >
              {Object.keys(Characters).map((character) => (
                <div key={character} style={{ marginRight: "4px" }}>
                  <CharacterThumbnailComponent
                    width={60}
                    name={character}
                    isActive={selectedCharacter && selectedCharacter.name === character}
                    onClick={() => updateCharacter(character)}
                  />
                </div>
              ))}
            </div>
          </SectionComponent>
        </Grid.Column>
        {Object.keys(Types).map((type: Types) => {
          return (
            <Grid.Column width={9} key={type}>
              <SectionComponent
                title={`${type} Selection`}
                collapsed={filterStates[type]}
                toggleCollapse={toggle[type]}
              >
                {getTypeValue(type).map((item, idx) => (
                  <ItemModalButton id={item.id} key={`${item.id}--${idx}`} />
                ))}
              </SectionComponent>
            </Grid.Column>
          );
        })}
      </Grid.Row>
    </Grid>
  );
};
