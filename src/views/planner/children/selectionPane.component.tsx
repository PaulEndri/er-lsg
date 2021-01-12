import React, { useContext } from "react";
import { Grid, Header, Segment } from "semantic-ui-react";
import { Character, Characters } from "erbs-sdk";
import { Types } from "../../../utilities/types";
import { ItemModalButton } from "../../../components/itemModalButton.component";
import { SectionComponent } from "../../../components/section.component";
import CharacterThumbnailComponent from "../../../components/characterThumbnail.component";
import { getList } from "../../../utilities/getList";
import { DataContext } from "../../../state/data";
import { FilterContext } from "../state";
import { Link } from "react-router-dom";

export const SelectionPaneComponent: React.FC = () => {
  const { character, updateCharacter } = useContext(DataContext);
  const { toggle, filterStates } = useContext(FilterContext);

  const getTypeValue = (type) =>
    type === Types.Weapon && character && character.attributes
      ? character.attributes.map((attr) => getList(attr.mastery as any)).flat()
      : getList(type);

  return (
    <Grid centered style={{ height: "max-content", marginTop: 0 }}>
      <Grid.Row stretched>
        <Grid.Column width={12}>
          <Segment style={{ borderRadius: 0 }} inverted color="black" raised stacked padded>
            <p>
              <Header inverted>Equipment/Loadout Selection</Header>
              Select your desired character and equipment below to either aid in{" "}
              <Link to="/planner/craft">creating your own routes</Link> or{" "}
              <Link to="/planner/route">automatically generating routes</Link>
            </p>
          </Segment>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row style={{ paddingTop: 0, marginTop: 0 }}>
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

export default SelectionPaneComponent;
