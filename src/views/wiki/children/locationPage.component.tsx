import React from "react";
import {
  Grid,
  Container,
  Menu,
  Segment,
  Header,
  Label,
  Button,
  Image,
  Table,
} from "semantic-ui-react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Locations, Location, IRawLocation } from "erbs-sdk";
import { getImageSrc } from "../../../utilities/getImageSrc";
import { ItemModalButton } from "../../../components/itemModalButton.component";
import { MapComponent } from "../../../components/map";

const LocationView: React.FC = ({ children }) => {
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
        {Object.keys(Locations)
          .filter((type) => !isNaN(Locations[type]))
          .map((type) => (
            <Menu.Item
              key={type}
              active={id === type}
              onClick={() => {
                history.push(`/wiki/locations/${type}`);
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

export const LocationLandingPage = () => {
  const history = useHistory();

  return (
    <LocationView>
      <Segment style={{ margin: 0, borderRadius: 0 }} color="orange" inverted>
        <Header inverted size="large">
          Lumia Island
        </Header>
      </Segment>
      <Segment basic>
        <MapComponent onClick={(e) => history.push(`/wiki/locations/${e}`)} />
      </Segment>

      <Segment style={{ margin: 0, borderRadius: 0 }} color="orange" inverted>
        <Header inverted size="large">
          Information
        </Header>
      </Segment>

      <Segment style={{ marginTop: 0, borderRadius: 0 }} textAlign="center">
        <Table selectable striped collapsing style={{ margin: "auto" }}>
          <Table.Header>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Wildlife</Table.HeaderCell>
            <Table.HeaderCell>Drops</Table.HeaderCell>
          </Table.Header>
          <Table.Body>
            {Object.entries(Location.SOURCES as Record<string, IRawLocation>).map(
              ([loc, locObject]) => (
                <Table.Row
                  key={loc}
                  onClick={() => history.push(`/wiki/locations/${locObject.name}`)}
                >
                  <Table.Cell>{locObject.name}</Table.Cell>
                  <Table.Cell>
                    {locObject.animals.map(({ name }, id) => (
                      <Label key={id}>{`${name}`.replace(/([A-Z])/g, " $1").trim()}</Label>
                    ))}
                  </Table.Cell>
                  <Table.Cell>
                    {locObject.drops.map(({ name, id, quantity }) => (
                      <Label key={id}>
                        {`${name}`.replace(/([A-Z])/g, " $1").trim()}
                        <Label.Detail>{quantity}</Label.Detail>
                      </Label>
                    ))}
                  </Table.Cell>
                </Table.Row>
              )
            )}
          </Table.Body>
        </Table>
      </Segment>
    </LocationView>
  );
};

export const LocationPage = () => {
  const { id } = useParams() as any;
  const history = useHistory();

  const location = id ? Location.SOURCES[id.replace(" ", "")] : null;

  return (
    <LocationView>
      <Segment
        color="black"
        fluid
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
            backgroundImage: `url(${process.env.PUBLIC_URL}/assets/images/locations/${id}.jpg) `,
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
          <Grid.Row centered style={{ backgroundColor: "rgba(10, 0, 0, 0.5)" }}>
            <Grid.Column width={16} textAlign="center">
              <Header inverted textAlign="center">
                Connections
              </Header>

              {location.connections &&
                location.connections.length > 0 &&
                location.connections.map(({ name }) => (
                  <Label
                    size="large"
                    color="yellow"
                    as={Button}
                    onClick={() => history.push(`/wiki/locations/${name}`)}
                  >
                    {name}
                  </Label>
                ))}
              {location.teleport && (
                <Image
                  as={Link}
                  centered
                  to="/wiki/locations"
                  size="tiny"
                  src={getImageSrc("hyperloop")}
                  inline
                  avatar
                />
              )}
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
            <Grid.Column width={16} textAlign="center" style={{ paddingBottom: "8px" }}>
              <Header inverted>Wild Life Catalog</Header>
            </Grid.Column>
            {location.animals.map(({ name, id }) => (
              <Grid.Column width={3} key={id}>
                <Link to={`/wiki/animals/${name}`}>
                  <Image centered size="medium" src={getImageSrc(`/animals/${name}`)} />
                </Link>
              </Grid.Column>
            ))}
          </Grid.Row>
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
            {location.drops.map(({ name, id, quantity }) => (
              <ItemModalButton id={name} key={id} label={quantity} />
            ))}
          </Grid.Row>
        </Grid>
      </Segment>
    </LocationView>
  );
};
