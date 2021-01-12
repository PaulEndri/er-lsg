import { Item } from "erbs-sdk";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Grid, Input, Segment, Transition, TransitionGroup } from "semantic-ui-react";
import { ItemCardComponent } from "../../../components/itemCard.component";
import { ItemModalButton } from "../../../components/itemModalButton.component";
import { BG_THIRD } from "../../../utilities/bgImages";

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
  title,
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
    <Grid>
      <Grid.Row
        style={{
          borderRadius: 0,
          marginBottom: 0,
          paddingBottom: 0,
        }}
        textAlign="center"
      >
        <Grid.Column width={16}>
          <Segment
            fluid
            stacked
            raised
            style={{
              borderRadius: 0,
              padding: 0,
              backgroundColor: "rgba(62, 58, 58, 1)",
            }}
          >
            <Input
              label={{ content: title, color: "orange" }}
              inline
              placeholder="Search Items"
              onChange={handleSearchChange}
            />
          </Segment>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row
        fluid
        style={{
          padding: "5rem",
          paddingTop: "10px",
          borderRadius: 0,
          backgroundColor: "rgba(31, 29, 29, 0.9)",
          backgroundImage: BG_THIRD,
          marginLeft: 0,
        }}
        textAlign="center"
      >
        {realSelectedItem && (
          <Grid.Column width={6} style={{ marginRight: 0, paddingRight: 0 }}>
            <Transition>
              <ItemCardComponent item={new Item(realSelectedItem)} />
            </Transition>
          </Grid.Column>
        )}
        <Grid.Column
          width={realSelectedItem ? 10 : 16}
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
