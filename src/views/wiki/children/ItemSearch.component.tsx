import { Item } from "erbs-sdk";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Grid, Input, Segment, Transition, TransitionGroup } from "semantic-ui-react";
import { IS_DESKTOP } from "../../../components/isDesktop";
import { ItemCardComponent } from "../../../components/itemCard.component";
import { ItemModalButton } from "../../../components/itemModalButton.component";

type Props = {
  setSelectedItem?: any;
  items: Item[];
  path?: string;
  selectedItem?: any;
  title: string;
};

export const ItemSearchComponent: React.FC<Props> = ({
  setSelectedItem,
  selectedItem,
  items,
  path,
}) => {
  const history = useHistory();
  const [searchString, updateSearchString] = useState(null);
  const [localItem, setLocalItem] = useState(null);

  const handleSearchChange = (e, { value }) => {
    if (value && value.length > 3) {
      updateSearchString(value.toLowerCase());
    } else if (!value) {
      updateSearchString(null);
    }
  };

  const updateSelected = (id, item) => {
    if (setSelectedItem) {
      setSelectedItem(id, item);
    } else {
      setLocalItem(id);
    }
  };

  const realSelectedItem = selectedItem || localItem;

  return (
    <Grid centered>
      <Grid.Row
        style={{
          marginBottom: 0,
          paddingBottom: 0,
        }}
        textAlign="center"
      >
        <Grid.Column width={16} style={{ padding: 0 }}>
          <Segment
            textAlign="center"
            style={{
              border: 0,
              padding: "1em",
              backgroundColor: "rgba(62, 58, 58, 1)",
            }}
          >
            <Input inline placeholder="Search Items" onChange={handleSearchChange} />
          </Segment>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row
        fluid
        style={{
          padding: IS_DESKTOP ? "5rem" : "1rem",
          paddingTop: "10px",

          backgroundColor: "rgba(150, 145, 138, 0.1)",
          boxShadow: "0px 0px 1px 1px black",
          marginLeft: 0,
        }}
        textAlign="center"
      >
        {realSelectedItem && (
          <Grid.Column width={5} style={{ marginRight: 0, paddingRight: 0 }}>
            <Transition>
              <ItemCardComponent item={new Item(realSelectedItem)} />
            </Transition>
          </Grid.Column>
        )}
        <Grid.Column
          width={realSelectedItem ? 6 : 11}
          style={{
            paddingTop: 10,
            marginLeft: 0,
          }}
          textAlign="center"
        >
          <TransitionGroup duration={100} animation="fade">
            {items
              .filter((item) => {
                if (!searchString) {
                  return true;
                }

                return (
                  `${item.name}`.toLowerCase().includes(searchString) ||
                  item.displayName.toLowerCase().includes(searchString)
                );
              })
              .sort((a, b) => a.rarityWeight - b.rarityWeight)
              .map((item) => (
                <ItemModalButton
                  key={item.id}
                  id={item.id}
                  action={() => {
                    if (path) {
                      history.push(`${path}/${item.clientType}`);
                    }
                    updateSelected(item.id, item);
                  }}
                />
              ))}
          </TransitionGroup>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};
