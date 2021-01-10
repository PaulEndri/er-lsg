import React from "react";
import {
  Grid,
  Container,
  Menu,
  Segment,
  Header,
  Label,
  Button,
  Table,
  Image,
} from "semantic-ui-react";
import { useHistory, useParams } from "react-router-dom";
import { Animal, IAnimal, AnimalsLookup } from "erbs-sdk";
import { ItemModalButton } from "../../../components/itemModalButton.component";
import { getImageSrc } from "../../../utilities/getImageSrc";

const AnimalView: React.FC = ({ children }) => {
  const history = useHistory();
  const { id } = useParams() as any;

  return (
    <Container fluid>
      <Menu
        className="attached"
        color="red"
        inverted
        style={{
          borderRadius: 0,
          marginBottom: 0,
          justifyContent: "center",
        }}
      >
        {Object.keys(AnimalsLookup)
          .filter((x) => isNaN(x as any))
          .map((type) => (
            <Menu.Item
              key={type}
              active={id === type}
              onClick={() => {
                history.push(`/wiki/animals/${type}`);
              }}
              color="red"
              style={{
                borderRadius: 0,
              }}
            >
              {type}
            </Menu.Item>
          ))}
      </Menu>
      {children}
    </Container>
  );
};

export const AnimalLandingPage = () => {
  const history = useHistory();

  return (
    <AnimalView>
      <Segment style={{ margin: 0, borderRadius: 0 }} color="orange" inverted>
        <Header inverted size="large">
          Lumia Island Wild Life Catalog
        </Header>
      </Segment>

      <Segment
        style={{ marginTop: 0, borderRadius: 0, background: "transparent" }}
        textAlign="center"
      >
        <Table selectable inverted striped collapsing style={{ margin: "auto", borderRadius: 0 }}>
          <Table.Header>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Locations</Table.HeaderCell>
            <Table.HeaderCell>Drops</Table.HeaderCell>
          </Table.Header>
          <Table.Body>
            {Object.entries<Animal>(Animal.SOURCES).map(([animal, aniObject]) => (
              <Table.Row key={animal} onClick={() => history.push(`/wiki/animals/${animal}`)}>
                <Table.Cell>{aniObject.displayName}</Table.Cell>
                <Table.Cell>
                  {Object.entries(aniObject.locations).map(([name, quantity], id) => (
                    <Label key={id} content={name} detail={quantity} />
                  ))}
                </Table.Cell>
                <Table.Cell>
                  {aniObject.items.map(({ name, percentage }) => (
                    <Label key={name}>
                      {`${name}`.replace(/([A-Z])/g, " $1").trim()}
                      <Label.Detail>{percentage}</Label.Detail>
                    </Label>
                  ))}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Segment>
    </AnimalView>
  );
};

export const AnimalPage = () => {
  const { id } = useParams() as any;
  const history = useHistory();

  const animal: Animal = id ? (Animal.Generate(id) as any) : null;

  return (
    <AnimalView>
      <Segment
        color="black"
        inverted
        style={{
          margin: 0,
          marginTop: 12,
          padding: 0,
          borderRadius: 0,
        }}
      >
        <Grid
          centered
          style={{
            backgroundImage: `url(${process.env.PUBLIC_URL}/assets/images/animals/${id}.jpg) `,
            backgroundSize: "cover",
          }}
        >
          <Grid.Row
            verticalAlign="middle"
            style={{
              backgroundColor: "rgba(76, 70, 70, 1)",
              borderBottom: "1px groove",
              borderTop: "1px groove",
            }}
            centered
          >
            <Grid.Column width={16} color="orange">
              <Header inverted textAlign="center">
                {id}
              </Header>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row
            verticalAlign="middle"
            style={{
              backgroundColor: "rgba(38, 35, 35, 0.5)",
              borderBottom: "1px groove",
              borderTop: "1px groove",
            }}
            centered
          >
            <Image centered size="medium" src={getImageSrc(`/animals/${animal.name}`)} />
          </Grid.Row>
          <Grid.Row centered style={{ backgroundColor: "rgba(10, 0, 0, 0.5)" }}>
            <Grid.Column width={16} textAlign="center">
              <Header inverted textAlign="center">
                Known Habitats
              </Header>

              {animal.locations &&
                Object.keys(animal.locations).length > 0 &&
                Object.entries(animal.locations).map(([name, quantity]) => (
                  <Label
                    size="large"
                    color="yellow"
                    as={Button}
                    onClick={() => history.push(`/wiki/location/${name}`)}
                    detail={quantity}
                    content={name}
                  />
                ))}
            </Grid.Column>
          </Grid.Row>

          <Grid.Column width={16} style={{ borderTop: "1px solid white" }}>
            <Header inverted textAlign="center">
              Drops
            </Header>
          </Grid.Column>
          <Grid.Row
            fluid
            style={{
              padding: "5rem",
              paddingTop: "10px",
              borderRadius: 0,
              backgroundColor: "rgba(31, 29, 29, 0.9)",
              marginLeft: 0,
            }}
            textAlign="center"
          >
            {animal.items.map(({ name, percentage }, id) => (
              <ItemModalButton id={`${name}`.replace(" ", "")} key={id} label={percentage + "%"} />
            ))}
          </Grid.Row>
        </Grid>
      </Segment>
    </AnimalView>
  );
};
