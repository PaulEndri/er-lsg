import React, { useContext } from "react";
import { Grid } from "semantic-ui-react";
import { Character, Characters } from "erbs-sdk";
import { Types } from "../../../utilities/types";
import { ItemModalButton } from "../../../components/itemModalButton.component";
import { SectionComponent } from "../../../components/section.component";
import CharacterThumbnailComponent from "../../../components/characterThumbnail.component";
import { getList } from "../../../utilities/getList";
import { LoadoutContext } from "../../../state/loadout";
import { FilterContext } from "../state";

export const SelectionPaneComponent: React.FC = () => {
  const { character, updateCharacter } = useContext(LoadoutContext);
  const { toggle, filterStates } = useContext(FilterContext);

  const getTypeValue = (type) =>
    type === Types.Weapon && character && character.attributes
      ? character.attributes.map((attr) => getList(attr.mastery as any)).flat()
      : getList(type);

  return (
    <Grid centered>
      <Grid.Row>
        <Grid.Column width={12}>
          <SectionComponent title="Test Subject Selection">
            <div
              style={{
                display: "flex",
                flexFlow: "row wrap",
                justifyContent: "center",
              }}
            >
              {Object.keys(Character.SOURCES).map((char) => (
                <div key={char} style={{ marginRight: "4px" }}>
                  <CharacterThumbnailComponent
                    width={60}
                    name={char}
                    isActive={character && character.name === char}
                    onClick={() => updateCharacter(char as keyof typeof Characters)}
                  />
                </div>
              ))}
            </div>
          </SectionComponent>
        </Grid.Column>
        {Object.keys(Types).map((type: Types) => {
          return (
            <Grid.Column width={12} key={type}>
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
