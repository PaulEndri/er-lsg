import { Categories, Item, Loadout, Weapons, WeaponsLookup } from "erbs-sdk";
import React, { PureComponent, useContext, useState } from "react";
import {
  Button,
  Card,
  Image,
  List,
  Label,
  Segment,
  Grid,
  Container,
  Header,
  Tab,
} from "semantic-ui-react";
import { SelectionPaneComponent } from "./children/selectionPane.component";
import { RoutePaneComponent } from "./children/routePane.component";
import { Types } from "../../utilities/types";
import { PageComponent } from "../../components/page";
import { getImageSrc } from "../../utilities/getImageSrc";
import { LoadOutItemComponent } from "./children/loadOutItem.component";
import { LoadoutContext } from "../../state/loadout.tsx";
import { FilterContext, FilterProvider } from "./state";
import { ItemModalContext } from "../../state/itemModal";
import { CharacterPortrait } from "../../components/characterPortrait.component";

export const initialLoadout = {
  Weapon: null,
  Chest: null,
  Head: null,
  Arm: null,
  Leg: null,
  Accessory: null,
};

const loadoutMenu = [Types.Weapon, Types.Chest, Types.Head, Types.Arm, Types.Leg, Types.Accessory];

const SidebarContents = ({ selectedCharacter, loadout, onLoadoutItemClick }) => (
  <React.Fragment>
    <Segment
      raised
      inverted
      secondary
      color="black"
      textAlign="center"
      placeholder={!selectedCharacter}
      fluid
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
  </React.Fragment>
);
const PlannerView = () => {
  const { loadout, character, updateCharacter } = useContext(LoadoutContext);
  const { setItem } = useContext(ItemModalContext);
  const { massUpdate, filterStates, toggle } = useContext(FilterContext);
  const [activeIndex, setActiveIndex] = useState(0);

  const onLoadoutItemClick = (item: Item<string>, type) => {
    setActiveIndex(0);

    if (item) {
      setItem(item);
    } else if (type) {
      let _type = Object.keys(Weapons).includes(type) ? Types.Weapon : type;

      const vals = Object.fromEntries(Object.keys(Types).map((key: any) => [key, key !== _type]));
      massUpdate(vals);
    }
  };

  const selectionPaneProps = {
    selectedCharacter: character,
    updateCharacter,
    filterStates,
    toggle,
  };
  return (
    <PageComponent
      title="Eternal Return: Black Survival Route & Loadout Planner"
      sidebarTitle="Loadout"
      sidebarItems={
        <SidebarContents
          loadout={loadout}
          selectedCharacter={character}
          onLoadoutItemClick={onLoadoutItemClick}
        />
      }
    >
      <Container fluid>
        <Grid centered>
          <Grid.Row>
            <Grid.Column width={16} style={{}}>
              <Segment
                style={{
                  padding: 1,
                  paddingTop: 0,
                  borderTop: 0,
                  backgroundColor: "rgba(51, 51, 51, 0.8)",
                }}
                basic
              >
                <Tab
                  activeIndex={activeIndex}
                  onTabChange={(e, props) => setActiveIndex(+props.activeIndex)}
                  menu={{
                    centered: true,
                    color: "red",
                    tertiary: true,
                    inverted: true,
                    attached: true,
                    style: { justifyContent: "center" },
                  }}
                  panes={[
                    {
                      menuItem: "Selections",
                      render: () => <SelectionPaneComponent {...selectionPaneProps} />,
                    },
                    {
                      menuItem: "Route Generation",
                      render: () => <RoutePaneComponent loadout={loadout} />,
                    },
                  ]}
                />
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </PageComponent>
  );
};

// wp ch hea arm leg acc

// q w e r d p

export default PlannerView;
