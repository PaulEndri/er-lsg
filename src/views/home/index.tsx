import React from "react";
import { Link } from "react-router-dom";
import { Container, Header, Segment } from "semantic-ui-react";
import { PageComponent } from "../../components/page";

const HomeView = () => {
  return (
    <PageComponent title="Eternal Return Lumia Survival Guide">
      <Container fluid textAlign="center">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            paddingTop: "10%",
          }}
        >
          <Header
            as={Link}
            to="/wiki"
            size="large"
            inverted
            className="fancy-hover"
            style={{
              marginBottom: 0,
              height: "100%",
              backgroundColor: "rgba(51, 51, 51, 0.7)",
              padding: "8% 5% 8% 5%",
              border: "2px inset rgba(255, 255, 255, 0.1)",
              borderRight: "3px groove rgba(200, 200, 200, 0.4)",
              textShadow: "0px 1px 4px rgba(255, 255, 255, 0.9)",
              background: "radial-gradient(rgba(51, 51,51,1), rgba(11, 11, 11, 0.5))",
            }}
          >
            <span style={{ paddingLeft: "-2rem" }}>Information</span>
            <br />
            <span style={{ paddingLeft: "3rem" }}>Center</span>
          </Header>
          <Header
            as={Link}
            to="/planner"
            size="large"
            inverted
            className="fancy-hover"
            style={{
              height: "100%",
              backgroundColor: "rgba(51, 51, 51, 0.7)",
              padding: "8% 5% 8% 5%",
              border: "2px inset rgba(255, 255, 255, 0.1)",
              borderLeft: "3px groove rgba(200, 200, 200, 0.4)",
              textShadow: "0px 1px 4px rgba(255, 255, 255, 0.9)",
              background: "radial-gradient(rgba(51, 51,51,1), rgba(11, 11, 11, 0.5))",
            }}
          >
            <span style={{ paddingRight: "2rem" }}>Surival</span>
            <br />
            <span style={{}}>Planner</span>
          </Header>
        </div>
      </Container>
    </PageComponent>
  );
};

export default HomeView;
